import ApiError from '../../common/errors/ApiError';
import passwordHelper from '../../common/helpers/password.helper';
import tokenHelper from '../../common/helpers/token.helper';
import redisService from '../../redis/redis.service';
import { JwtPayload, RegisterResponse } from './auth.interface';
import authRepository from './auth.repository';
import {
    LoginUserInput,
    RefreshTokenInput,
    RegisterUserInput
} from './auth.types';

class AuthService {
    async register(data: RegisterUserInput): Promise<RegisterResponse> {
        const existingUser = await authRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ApiError(409, 'User already exists');
        }

        const hashedPassword = await passwordHelper.hashPassword(data.password);

        const user = await authRepository.createUser({
            ...data,
            password: hashedPassword
        });

        const payload = {
            id: user._id
        };

        const accessToken = tokenHelper.generateAccessToken(payload);

        const refreshToken = tokenHelper.generateRefreshToken(payload);

        await redisService.set(
            `refresh:${user._id}`,
            refreshToken,
            7 * 24 * 60 * 60
        );

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async login(data: LoginUserInput) {
        const user = await authRepository.findByEmail(data.email);

        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isPasswordCorrect = await passwordHelper.comparePassword(
            data.password,
            user.password
        );

        if (!isPasswordCorrect) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const payload = {
            id: user._id
        };

        const accessToken = tokenHelper.generateAccessToken(payload);

        const refreshToken = tokenHelper.generateRefreshToken(payload);

        await redisService.set(
            `refresh:${user._id}`,
            refreshToken,
            7 * 24 * 60 * 60
        );

        return {
            user,
            accessToken,
            refreshToken
        };
    }

    async refreshToken(data: RefreshTokenInput) {
        const decoded = tokenHelper.verifyRefreshToken(
            data.refreshToken
        ) as JwtPayload;

        const storedToken = await redisService.get(`refresh:${decoded.id}`);

        if (!storedToken || storedToken !== data.refreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const accessToken = tokenHelper.generateAccessToken({
            id: decoded.id
        });

        return {
            accessToken
        };
    }

    async logout(userId: string) {
        await redisService.remove(`refresh:${userId}`);
    }
}

export default new AuthService();

import ApiError from '../../common/errors/ApiError';
import passwordHelper from '../../common/helpers/password.helper';
import tokenHelper from '../../common/helpers/token.helper';
import { RegisterResponse } from './auth.interface';
import authRepository from './auth.repository';
import { RegisterUserInput } from './auth.types';

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

        const accessToken = tokenHelper.generateAccessToken({
            id: user._id
        });

        return {
            user,
            accessToken
        };
    }
}

export default new AuthService();

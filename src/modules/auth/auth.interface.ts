import { IUser } from '../../database/models/User.model';

export interface RegisterResponse {
    user: IUser;
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    id: string;
}

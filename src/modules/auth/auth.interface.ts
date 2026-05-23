import { IUser } from '../../database/models/User.model';

export interface RegisterResponse {
    user: IUser;
    accessToken: string;
}

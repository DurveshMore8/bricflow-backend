import User from '../../database/models/User.model';
import { RegisterUserInput } from './auth.types';

class AuthRepository {
    async findByEmail(email: string) {
        return User.findOne({
            email
        });
    }

    async createUser(user: RegisterUserInput) {
        return User.create(user);
    }
}

export default new AuthRepository();

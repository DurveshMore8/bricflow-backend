import bcrypt from 'bcrypt';

class PasswordHelper {
    async hashPassword(password: string) {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }
}

export default new PasswordHelper();

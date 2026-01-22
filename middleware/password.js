import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

export async function hashPassword(password) {
    console.log(SALT_ROUNDS)
    return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
}

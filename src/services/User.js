import bcrypt from "bcryptjs";
import crypto from 'crypto';

const userModel = {};

userModel.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}
userModel.comparePass = async (password, receivesPass) => {
    return await bcrypt.compare(password, receivesPass)
}


userModel.generateString = (rounds) => {
    return crypto.randomBytes(rounds).toString('hex');
}

userModel.generateHash = (randomString, salt = crypto.randomBytes(16).toString('hex')) => {
    const hash = crypto.pbkdf2Sync(randomString, salt, 1000, 64, 'sha512').toString('hex');

    return { salt, hash };
}

userModel.verifyHash = (randomString, hash, salt) => {
    const verifyHash = crypto.pbkdf2Sync(randomString, salt, 1000, 64, 'sha512').toString('hex');
    console.log(hash === verifyHash)
    return hash === verifyHash;
}

module.exports = userModel
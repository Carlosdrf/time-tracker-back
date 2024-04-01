import bcrypt from "bcryptjs";
const userModel = {}

userModel.encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt)
}
userModel.comparePass = async (password, receivesPass) => {
    return await bcrypt.compare(password, receivesPass)
}

module.exports = userModel
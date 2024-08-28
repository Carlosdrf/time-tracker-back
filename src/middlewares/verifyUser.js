import db from '../../models';


export const verifyUser = async (req, res, next) => {
    const findUser = await db.users.findOne({ where: { email: req.body.email } });
    if (!findUser) {
        return res.status(404).json({ message: `user does not exist` });
    }
    if (findUser.active == '0') {
        return res.status(404).json({ message: `Your user is inactive` });
    }
    return next();
}

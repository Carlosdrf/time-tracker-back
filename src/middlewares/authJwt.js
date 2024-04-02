import jwt from "jsonwebtoken";
import config from "../config";
import roleModel from "../services/Role";
import db from "../../models";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) return res.status(403).json({ message: "No token providen" });
    const tokenKey = token.split(" ")[1];
    const decoded = jwt.verify(tokenKey, config.SECRET);
    req.userId = decoded.id;
    console.log('req.userId', req.userId)
    // req.name = decoded.name;
    req.role = decoded.role;
    const user = await db.users.findOne({ where: { id: req.userId } });
    if (!user) res.status(404).json({ message: "No user found" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
export const isAdmin = async (req, res, next) => {
  const role = await roleModel.verifyUserRole(req.userId);
  if (role[0].id === 1) {
    next();
    return;
  }
  return res.status(403).json({ message: "Don't have the right permission" });
};
export const isEmployee = async (req, res, next) => {
  const role = await roleModel.verifyUserRole(req.userId);
  if (role[0].id === 1 || role[0].id === 2) {
    next();
    return;
  }
  return res.status(403).json({ message: "Wrong role" });
};

export const isEmployer = async (req, res, next) => {
  const role = await roleModel.verifyUserRole(req.userId);
  if (role[0].id === 3) {
    next();
    return;
  }
  return res.status(403).json({ message: "Wrong role" });
};

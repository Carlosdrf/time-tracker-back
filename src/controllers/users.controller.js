import usersModel from "../models/User";
import * as format from "../services/utc.format";
import db from '../../models'

export const getUsers = async (req, res) => {
  // const token = await genNewToken(req)
  // console.log(req.body)
  const result = await usersModel.getUsersList(req.body.searchField);
  res.json(result);
};

export const createUser = async (req, res) => {
  console.log(req.body)
  const {name, last_name, password, email} = req.body
  const encryptPass = await usersModel.encryptPass(password)
  const user = await db.Users.create({name, last_name, password: encryptPass, email})
  console.log(user)
  res.json(req.body)
};

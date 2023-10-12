import usersModel from "../models/User";
import * as format from "../services/utc.format";
import db from '../../models'
import roleModel from '../models/Role'
import { where } from "sequelize";

export const getUsers = async (req, res) => {
  // const token = await genNewToken(req)
  // console.log(req.body)
  const result = await usersModel.getUsersList(req.body.searchField);
  res.json(result);
};

export const createUser = async (req, res) => {
  console.log(req.body)
  const { name, last_name, password, email, role } = req.body

  const checkUser = await db.Users.findOne({ where: { email } })
  if (checkUser) {
    res.status(400).json({ message: 'User Already Exists' })
    return 0
  }
  const encryptPass = await usersModel.encryptPass(password)

  let userInfo = {
    name,
    last_name,
    email,
    role,
    password: encryptPass,
  }
  const user = await db.Users.create(userInfo)
  await db.user_roles.create({user_id:user.dataValues.id, role_id: role})
  if (roleModel.EMPLOYER_ROLE === role) {
    console.log('client role')
    
    let company = { name: req.body.company.name, description: req.body.company.description }
    let newCompany = await db.companies.create(company)
    await db.companies_users.create({user_id: user.dataValues.id, company_id: newCompany.dataValues.id})
  } else if (roleModel.USER_ROLE === role) {
    let company_id = req.body.company.id
    await db.employees.create({user_id: user.dataValues.id, company_id})
  }

  console.log(user.dataValues.id)

  res.json(req.body)
};

export const getEmployees = async (req, res) => {
  const company = await db.companies_users.findOne({ where: { user_id: req.userId } });
  const employees = await db.employees.findAll({
    include: [{ model: db.Users }],
    where: { company_id: company.company_id }
  })

  res.json(employees)
}
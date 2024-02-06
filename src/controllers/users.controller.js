import usersModel from "../models/User";
const { Op } = require('sequelize');

import * as format from "../services/utc.format";
import db, { sequelize } from "../../models";
import roleModel from "../models/Role";
import { where } from "sequelize";

export const getUsers = async (req, res) => {
  // const token = await genNewToken(req)
  console.log(req.body)
  const result = await usersModel.getUsersList(req.body.searchField);

  const querySearch = req.body.searchField !== '' ?
    {
      [Op.or]: [
        [{ name: { [Op.like]: `%${req.body.searchField}%` } }],
        [{ last_name: { [Op.like]: `%${req.body.searchField}%` } }]
      ]
    }
    : {}
  req.body.filter = 'filter'
  const queryFilter = req.body.filter !== '' ?
    {
      [Op.and]: [
        [{ name: req.body.filter }]
      ]
    } : {}
  console.log(queryFilter)
  const seq = await db.users.findAll({
    include: [
      {
        model: db.user_roles, required: false,
        // attributes: [],
        include: [{
          model: db.roles,
          required: false,
          attributes: ['id', 'name']
        }],
      },
      {
        model: db.companies_users, required: false,
        // attributes: [],
        include: [{
          model: db.companies,
          required: false,
          attributes: ['id', 'name', 'description']
        }],
      }
    ],
    where: querySearch,
    attributes: {
      exclude: ['password'],
    }
  })
  const sample = seq.map(item => {
    // item.dataValues.role = 'string'
    // console.log(item.dataValues)
    item.dataValues.user_roles.forEach(user_role=>{
      console.log(user_role.dataValues.role.dataValues.id)
      item.dataValues.role = user_role.dataValues.role.dataValues.id
      item.dataValues.role_name = user_role.dataValues.role.dataValues.name
      // user_role.dataValues.role.map(roles=>{
      //   console.log(roles.dataValues)
      // })
    })
    return item
  })
  res.json(sample);
};

export const createUser = async (req, res) => {
  console.log(req.body);
  const { name, last_name, password, email, role } = req.body;

  const checkUser = await db.users.findOne({ where: { email } });
  if (checkUser) {
    res.status(400).json({ message: "User Already Exists" });
    return 0;
  }
  const encryptPass = await usersModel.encryptPass(password);

  let userInfo = {
    name,
    last_name,
    email,
    role,
    password: encryptPass,
  };
  const user = await db.users.create(userInfo);
  await db.user_roles.create({ user_id: user.dataValues.id, role_id: role });
  if (roleModel.EMPLOYER_ROLE === role) {
    console.log("client role");

    let company = {
      name: req.body.company.name,
      description: req.body.company.description,
    };
    let newCompany = await db.companies.create(company);
    await db.companies_users.create({
      user_id: user.dataValues.id,
      company_id: newCompany.dataValues.id,
    });
  } else if (roleModel.USER_ROLE === role) {
    let company_id = req.body.company.id;
    await db.employees.create({ user_id: user.dataValues.id, company_id });
  }

  console.log(user.dataValues.id);

  res.json(req.body);
};

export const getEmployees = async (req, res) => {
  const company = await db.companies_users.findOne({
    where: { user_id: req.userId },
  });
  const employees = await db.employees.findAll({
    include: [{ model: db.users }],
    where: { company_id: company.company_id },
  });
  res.json(employees);
};

export const verifyUsername = async (req, res) => {
  const { email, userId } = req.body;
  console.log(email)
  const userExists = await db.users.findOne({
    where: { email, id: { [Op.ne]: userId } },
  });

  if (userExists)
    return res.status(300).json({ message: "that user is taken" });
  res.status(200).json({ message: "you can use the username" });
};

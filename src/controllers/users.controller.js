import usersModel from "../models/User";
const { Op } = require('sequelize');
import db, { sequelize } from "../../models";
import roleModel from "../models/Role";

export const handleFilter = (items, filter) => {
  let searchBy = []
  let filterBy = []
  let result = {};
  items.forEach(item => {
    if (item !== '')
      searchBy.push(
        {
          name: {
            [Op.like]: `%${item}%`
          }
        },
        {
          last_name: {
            [Op.like]: `%${item}%`
          }
        }
      )
  });
  if (searchBy.length > 0) result[Op.or] = searchBy
  if (filter) {
    filterBy = [sequelize.literal("`user_roles->role`.`id` = " + filter)]
    result[Op.and] = filterBy
  }
  return result;
}
export const getUsers = async (req, res) => {
  const { searchField, filter } = req.body
  // const token = await genNewToken(req)
  const searchQuery = handleFilter(searchField.split(' '), filter)

  let users = await db.users.findAll({
    include: [
      {
        model: db.user_roles,
        required: false,
        attributes: [],
        include: {
          model: db.roles,
          attributes: [],
          required: false,
        }
      }, {
        model: db.companies_users,
        required: false,
        attributes: [],
        include: {
          model: db.companies,
          attributes: [],
          required: false
        }
      },
      {
        model: db.employees,
        required: false,
        // attributes: ['id'],
        include: {
          model: db.companies,
          required: false
        }
      }
    ],
    where: searchQuery,
    order: ['name'],
    raw: true,
    attributes: {
      exclude: ['password'],
      include: [
        [sequelize.literal('`user_roles->role`.`id`'), 'role'],
        [sequelize.literal('`companies_users->company`.`id`'), 'company_id'],
        [sequelize.literal('`companies_users->company`.`name`'), 'company_name'],
        [sequelize.literal('`companies_users->company`.`description`'), 'company_description']
      ],
    }
  })
  const usersFormatted = users.map((user) => {
    let userFormat = {}
    userFormat.id = user.id
    userFormat.name = user.name
    userFormat.last_name = user.last_name
    userFormat.email = user.email
    userFormat.role = user.role
    if (user.company_id) {
      userFormat.company = {
        id: user.company_id,
        name: user.company_name,
        description: user.company_description
      }
    }
    if (user['employees.id']) {
      userFormat.employee = {
        id: user['employees.company.id'],
        company: user['employees.company.name']
      }
    }
    return userFormat
  })

  res.json(usersFormatted);
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

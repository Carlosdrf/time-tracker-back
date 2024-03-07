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
  }
  const filterExclude = [sequelize.literal("`user_roles->role`.`id` <> 1")]
  result[Op.and] = [...filterBy, ...filterExclude]
  return result;
}
export const getUsers = async (req, res) => {
  const { searchField, filter } = req.body
  // const token = await genNewToken(req)
  let searchQuery;
  if (searchField != null) searchQuery = handleFilter(searchField.split(' '), filter)

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
        [sequelize.literal('`companies_users->company`.`description`'), 'company_description'],

      ],
    }
  })
  let entriesReview = await db.entries.findAll({ where: sequelize.literal("TIMEDIFF(end_time, start_time) >= '10:00:00'") });
  let usersForReview = []
  entriesReview.forEach(reviewUser => {
    usersForReview.push(reviewUser.user_id)
  })
  const usersFormatted = users.map((user) => {
    let userFormat = {}
    userFormat.id = user.id
    userFormat.name = user.name
    userFormat.last_name = user.last_name
    userFormat.email = user.email
    userFormat.role = user.role
    if (usersForReview.indexOf(user.id) != -1) {
      userFormat.review = entriesReview.filter((entry) => user.id == entry.user_id)
    }
    userFormat.active = user.active
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
  const { id, name, last_name, password, email, role, company, employee } = req.body;
  if (id == "-1") {
    const checkUser = await db.users.findOne({ where: { email } });
    if (checkUser) {
      res.status(400).json({ message: "User Already Exists" });
      return 0;
    }
  }
  let userInfo = {
    name,
    last_name,
    email,
    role,
  };
  let encryptPass = '';
  if (password) {
    encryptPass = await usersModel.encryptPass(password);
  }
  if (encryptPass !== '') userInfo.password = encryptPass

  if (id !== '-1') {
    await db.users.update(userInfo, { where: { id: id } })
    await db.user_roles.update({ role_id: role }, { where: { user_id: id } })
    if (roleModel.EMPLOYER_ROLE == role) {
      const checkCompany = await db.companies_users.findAll({ where: { user_id: id } })
      if (checkCompany.length > 0) await db.companies.update({ name: company.name, description: company.description }, { where: { id: company.id } })
      else {
        const newCompany = await db.companies.create({ name: company.name, description: company.description })
        await db.companies_users.create({ user_id: id, company_id: newCompany.dataValues.id })
      }
      await db.employees.destroy({ where: { user_id: id } })
    }
    if (roleModel.USER_ROLE == role) {
      if (employee.id != '') {
        const checkEmployee = await db.employees.findAll({ where: { user_id: id } })
        if (checkEmployee.length > 0) await db.employees.update({ company_id: employee.id }, { where: { user_id: id } })
        else await db.employees.create({ user_id: id, company_id: employee.id })
      }
      await db.companies_users.destroy({ where: { user_id: id } })
    }
    userInfo.id = id
  } else {
    userInfo = await createNewUser(req, userInfo)

  }
  userInfo.company = company
  userInfo.employee = employee
  userInfo.password = ''

  res.json(userInfo);
};

export const createNewUser = async (req, userInfo) => {
  const user = await db.users.create(userInfo);
  await db.user_roles.create({ user_id: user.dataValues.id, role_id: userInfo.role });
  if (roleModel.EMPLOYER_ROLE == userInfo.role) {
    let company = {
      name: req.body.company.name,
      description: req.body.company.description,
    };
    let newCompany = await db.companies.create(company);
    await db.companies_users.create({
      user_id: user.dataValues.id,
      company_id: newCompany.dataValues.id,
    });
  } else if (roleModel.USER_ROLE == userInfo.role && req.body.employee.id) {
    let company_id = req.body.employee.id;
    await db.employees.create({ user_id: user.dataValues.id, company_id });
  }
  userInfo.id = user.dataValues.id
  return userInfo;
}

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

export const deleteUser = async (req, res) => {
  console.log(req.params)
  await db.users.destroy({ where: { id: req.params.id } })
  res.json({ message: "User Deleted Successfully" })
}

export const updateUser = async (req, res) => {
  await db.users.update(req.body, { where: { id: req.params.id } })
  res.json(req.body)
}

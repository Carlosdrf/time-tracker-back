import usersModel from "../services/User";
const { Op } = require("sequelize");
import db, { sequelize } from "../../models";
import roleModel from "../services/Role";
import moment from "moment";
import { Mailer } from "../services/Nodemailer";

export const handleFilter = (items, filter) => {
  let searchBy = [];
  let filterBy = [];
  let result = {};

  items.forEach((item) => {
    if (item !== "")
      searchBy.push(
        {
          name: {
            [Op.like]: `%${item}%`,
          },
        },
        {
          last_name: {
            [Op.like]: `%${item}%`,
          },
        }
      );
  });
  
  if (searchBy.length > 0) result[Op.or] = searchBy;
  if (filter.role) {
    filterBy.push(sequelize.literal("`roles->user_roles`.`role_id` = " + filter.role))
  }
  if (filter.status !== undefined) {
    const status = filter.status ? 1 : 0;
    filterBy.push(sequelize.literal("`users`.`active` = " + status));
  }
  const filterExclude = [sequelize.literal("`roles->user_roles`.`role_id` <> 1")];
  result[Op.and] = [...filterBy, ...filterExclude];
  return result;
};
export const getUsers = async (req, res) => {
  const { searchField, filter } = req.body;

  let searchQuery;
  if (searchField != null)
    searchQuery = handleFilter(searchField.split(" "), filter);

  let users = await db.users.findAll({
    include: [
      {
        model: db.roles,
        attributes: [],
        required: false,
      },
      {
        model: db.companies,
        required: false,
      },
      {
        model: db.employees,
        required: false,
        include: [
          {
            model: db.companies,
            required: false,
          },
          {
            model: db.positions,
            required: false,
          },
        ],
      },
    ],
    where: searchQuery,
    order: ["name"],
    raw: true,
    attributes: {
      exclude: ["password"],
      include: [
        [sequelize.literal("`roles->user_roles`.`role_id`"), "role"],
      ],
    },
  });
  let entriesReview = await db.entries.findAll({
    where: { status: 2 },
  });
  let usersForReview = [];
  entriesReview.forEach((reviewUser) => {
    usersForReview.push(reviewUser.user_id);
  });
  const usersFormatted = await Promise.all(
    users.map(async (user) => {
      let userFormat = {};
      userFormat.id = await user.id;
      userFormat.name = user.name;
      userFormat.last_name = user.last_name;
      userFormat.email = user.email;
      userFormat.role = user.role;
      if (usersForReview.indexOf(user.id) != -1) {
        userFormat.review = entriesReview.filter(
          (entry) => user.id == entry.user_id
        );
      }
      userFormat.active = user.active;
      if (user['companies.id']) {
        userFormat.company = {
          id: user['companies.id'],
          name: user['companies.name'],
          description: user['companies.description'],
          timezone: user['companies.timezone'],
        };
      }
      if (user["employees.id"]) {
        const schedules = await db.schedules.findAll({
          include: [
            {
              model: db.employees,
              where: { user_id: user.id }
            },
            {
              model: db.days
            }
          ]
        })

        userFormat.employee = {
          id: user["employees.company.id"],
          company: user["employees.company.name"],
          position: user["employees.position_id"],
          position_name: user["employees.position.title"],
          hourly_rate: user['employees.hourly_rate'],
          schedule: schedules
        };
      }
      return userFormat;
    })
  )

  res.json(usersFormatted);
};

export const createUser = async (req, res) => {
  const { id, name, last_name, password, email, role, company, employee, active } =
    req.body;
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
    active
  };

  let encryptPass = "";
  if (password) {
    encryptPass = await usersModel.encryptPass(password);
  }
  if (encryptPass !== "") userInfo.password = encryptPass;

  if (id !== "-1") {
    await db.users.update(userInfo, { where: { id: id } });
    await db.user_roles.update({ role_id: role }, { where: { user_id: id } });
    if (roleModel.EMPLOYER_ROLE == role) {
      const user = await db.users.findByPk(id)
      const userCompany = await user.getCompanies()
      if (userCompany.length > 0 && company.id != userCompany[0].id) {
        await user.removeCompany(userCompany[0].id)
        await user.addCompany(company.id)
      }
      if (!userCompany.length > 0) {
        await user.addCompany(company.id)
      }

      await db.employees.destroy({ where: { user_id: id } });
    }
    if (roleModel.USER_ROLE == role) {
      let checkEmployee;
      if (employee.id != "") {
        checkEmployee = await db.employees.findOne({
          where: { user_id: id },
        });
        let employeeInfo = {
          company_id: employee.id,
          position_id: employee.position,
          hourly_rate: employee.hourly_rate,
        };
        if (checkEmployee) {
          checkEmployee.company_id = employeeInfo.company_id
          await checkEmployee.save();
          await db.employees.update(employeeInfo, { where: { user_id: id } });
        } else {
          checkEmployee = await db.employees.create({ user_id: id, company_id: employee.id });
        };
        if (employee.schedule) {
          await db.schedules.destroy({ where: { employee_id: checkEmployee.id } })
          for (let schedule of employee.schedule) {
            let { start_time, end_time, days } = schedule
            const newSchedule = await db.schedules.create({
              start_time: await convertStrIntoTime(start_time),
              end_time: await convertStrIntoTime(end_time),
              employee_id: checkEmployee.id,
              approved_by: req.userId,
            })
            for (let day of days) {
              await db.schedules_days.create({ day_id: day.id, schedule_id: newSchedule.id })
            }
          }
        }
      }
      await db.companies_users.destroy({ where: { user_id: id } });
    }
    userInfo.id = id;
  } else {
    userInfo = await createNewUser(req, userInfo);
  }
  userInfo.company = company;
  userInfo.employee = employee;

  delete userInfo.password
  const user = await getUserInfo(userInfo.id)
  res.json(user);
};

export const getUserInfo = async (userId) => {
  let user = await db.users.findOne({
    where: { id: userId },
    include: [
      {
        model: db.roles,
        required: false,
        attributes: []
      },
    ],
    attributes: {
      include: [[sequelize.literal('`roles`.`id`'), 'role']]
    }
  })
  const company = await user.getCompanies()
  const employee = await user.getEmployees()
  if (company.length > 0) user.dataValues.company = company[0]
  if (employee.length > 0) user.dataValues.employee = {
    id: employee[0].company_id,
    position: employee[0].position_id,
    hourly_rate: employee[0].hourly_rate,
    schedule: await db.schedules.findAll(
      {
        where: { employee_id: employee[0].id },
        include: [{
          model: db.days
        }]
      })
  }
  return user;
}

export const createNewUser = async (req, userInfo) => {
  const { employee } = req.body
  const user = await db.users.create(userInfo);
  await db.user_roles.create({
    user_id: user.dataValues.id,
    role_id: userInfo.role,
  });
  if (roleModel.EMPLOYER_ROLE == userInfo.role) {
    let company = {
      name: req.body.company.name,
      description: req.body.company.description,
      timezone: req.body.company.timezone,
    };
    await user.addCompany(req.body.company.id)

  } else if (roleModel.USER_ROLE == userInfo.role && req.body.employee.id) {
    let company_id = req.body.employee.id;

    await db.employees.create({ user_id: user.dataValues.id, company_id, hourly_rate: req.body.employee.hourly_rate, position_id: req.body.employee.position });
    if (employee.schedule) {
      for (let schedule of employee.schedule) {
        let { start_time, end_time, days } = schedule
        await db.schedules.upsert()
        const newSchedule = await db.schedules.create({
          start_time: await convertStrIntoTime(start_time),
          end_time: await convertStrIntoTime(end_time),
          employee_id: checkEmployee.id,
          approved_by: req.userId,
        })
        for (let day of days) {
          await db.schedules_days.create({ day_id: day.id, schedule_id: newSchedule.id })
        }
      }
    }
  }
  userInfo.id = user.dataValues.id;
  return userInfo;
};

export const getEmployees = async (req, res) => {
  const company = await db.companies_users.findOne({
    where: { user_id: req.userId },
  });
  const employees = await db.employees.findAll({
    include: [
      {
        model: db.users, where: { active: { [Op.ne]: 0 } },
        attributes: {
          include: [[sequelize.literal('`user->roles`.`id`'), 'role']]
        },
        include: {
          model: db.roles,
          attributes: []
        }
      }
    ],
    where: { company_id: company.company_id },

  });
  res.json(employees);
};

export const verifyUsername = async (req, res) => {
  const { email, userId } = req.body;

  const userExists = await db.users.findOne({
    where: { email, id: { [Op.ne]: userId } },
  });

  if (userExists)
    return res.status(300).json({ message: "That user is taken" });
  res.status(200).json({ message: "you can use the username" });
};

export const deleteUser = async (req, res) => {
  await db.users.destroy({ where: { id: req.params.id } });
  res.json({ message: "User Deleted Successfully" });
};

export const updateUser = async (req, res) => {
  await db.users.update(req.body, { where: { id: req.params.id } });
  res.json(req.body);
};

export const convertStrIntoTime = async (timeString) => {
  if (timeString.includes(' ')) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier.toLowerCase() == 'pm' && hours !== 12) {
      hours += 12;
    } else if (modifier.toLowerCase() == 'am' && hours === 12) {
      hours = 0;
    }
    return `${hours}:${minutes}:00`;
  }
  return timeString
}

export const createPossibleTeamMember = async (req, res) => {
  try {
    await Mailer.sendMail(req)
    res.status(200).json(true)
  } catch (err) {
    res.status(400).json(err)
  }

}
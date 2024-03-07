import fetch from "node-fetch";
import moment from "moment-timezone";
import * as format from "../services/utc.format";
import db, { sequelize } from "../../models";
const Op = require("../../models").Sequelize.Op;
import * as roleModel from "../models/Role";

import fs from "fs";
const excel = require("excel4node");
const path = require("path");

export const report = async function cronReport() {
  console.log("cron test");

  await fetch("http://localhost:3001/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ message: "mensaje para enviar" }),
  })
    .then((res) => console.log(`nodemailer response: ${res.status}`))
    .catch((err) => console.log(err));
};

export const getRange = async (req, res) => {
  const end_time = await format.UTCend(req.body.lastSelect);
  const start_time = await format.UTCStart(req.body.firstSelect);
  const dateRange = {
    start_time: new Date(req.body.firstSelect),
    end_time: new Date(new Date(req.body.lastSelect).setHours(23, 59, 59))
  };
  if (req.role == roleModel.ADMIN_ROLE && req.body.user_id == null) {
    const row = await db.entries.findAll({
      where: { status: 1, start_time: { [Op.between]: [dateRange.start_time, dateRange.end_time] } },
    })
    res.json(row);
  } else if (
    (req.role == roleModel.ADMIN_ROLE || req.role == roleModel.EMPLOYER_ROLE) &&
    req.body.user_id != null
  ) {
    let row;
    console.log('client/admin with a user id provided')
    const where = { status: 1, user_id: req.body.user_id, start_time: { [Op.between]: [dateRange.start_time, dateRange.end_time] } }
    if (req.body.role == 3) {
      // if there's a role received from the front end and the role is equal to employer type it will look for their employees
      const { company_id } = await db.companies_users.findOne({ where: { user_id: req.body.user_id } })
      const employees = await db.employees.findAll({ where: { company_id: company_id } })
      const ids = employees.map((employee, i) => employee.user_id);
      row = await db.entries.findAll({
        where: { user_id: ids, status: 1 },
        start_time: { [Op.between]: [dateRange.start_time, dateRange.end_time] }
      })
    } else {
      row = await db.entries.findAll({
        where: where,
      })
    }
    res.json(row);
  } else if (req.role == roleModel.EMPLOYER_ROLE && req.body.user_id == null) {
    const companies = await db.companies_users.findOne({
      where: { user_id: req.userId },
    });
    const employees = await db.employees.findAll({
      where: { company_id: companies.id },
    });
    let users_id = []
    employees.forEach((item, i) => {
      users_id[i] = item.dataValues.user_id
    });
    const entries = await db.entries.findAll({
      where: { start_time: { [Op.between]: [start_time, end_time] }, user_id: users_id },
    });
    res.json(entries);
  } else {
    const row = await db.entries.findAll({ where: { user_id: req.userId, start_time: { [Op.between]: [dateRange.start_time, dateRange.end_time] } } });
    res.json(row);
  }
};
export const getReport = async (req, res) => {
  const end_time = await format.UTCend(req.body.lastSelect);
  const start_time = await format.UTCStart(req.body.firstSelect);
  const dateRange = {
    start_time: new Date(req.body.firstSelect),
    end_time: new Date(new Date(req.body.lastSelect).setHours(23, 59, 59))
  };

  const workbook = new excel.Workbook();
  let nombreArchivo = "report i-nimble";

  var worksheet = workbook.addWorksheet(nombreArchivo);

  let row;
  if (req.role == 1 && req.body.user_id == null) {
    console.log('admin and no user id provided')
    row = await db.entries.findAll({
      where: {
        start_time: { [Op.between]: [start_time, end_time] },
        status: 1
      },
      include: [{
        model: db.users,
        attributes: []
      },
      {
        model: db.tasks,
        required: false,
        attributes: []
      }],
      raw: true,
      attributes: {
        include: [
          [sequelize.literal('user.name'), 'name'],
          [sequelize.literal('user.last_name'), 'last_name'],
          [sequelize.literal('user.email'), 'email'],
          [sequelize.literal('task.description'), 'description']
        ]
      },
      order: [[sequelize.literal('user.name')], [sequelize.literal('user.last_name')], ['start_time', 'desc']]
    })
  } else if (req.role != 2 && req.body.user_id != null) {
    console.log('admin/client and user id provided')
    let where = {
      start_time: { [Op.between]: [start_time, end_time] },
      status: 1
    }

    if (req.body.role == 3) {
      const { company_id } = await db.companies_users.findOne({ where: { user_id: req.body.user_id } })
      const employees = await db.employees.findAll({ where: { company_id: company_id } })
      const ids = employees.map((employee, i) => employee.user_id);
      where.user_id = ids
    } else {
      where.user_id = req.body.user_id
    }
    row = await await db.entries.findAll({
      where: where,
      include: [{
        model: db.users,
        attributes: []
      },
      {
        model: db.tasks,
        required: false,
        attributes: []
      }],
      raw: true,
      attributes: {
        include: [
          [sequelize.literal('user.name'), 'name'],
          [sequelize.literal('user.last_name'), 'last_name'],
          [sequelize.literal('user.email'), 'email'],
          [sequelize.literal('task.description'), 'description']
        ]
      },
      order: [[sequelize.literal('user.name')], ['start_time', 'desc']]
    })

  } else if (req.role == roleModel.EMPLOYER_ROLE && req.body.user_id == null) {
    console.log("client call");
    // row = await models.getReport(dateRange, req.body.user_id);
    const company = await db.companies_users.findOne({ where: { user_id: req.userId } })
    const employees = await db.employees.findAll({ where: { company_id: company.id } })
    let ids = []
    employees.forEach((element, i) => {
      ids[i] = element.user_id
    });
    row = await db.entries.findAll({
      where: {
        user_id: ids,
        start_time: { [Op.between]: [start_time, end_time] },
        status: 1
      },
      include: [{
        model: db.users,
        attributes: []
      },
      {
        model: db.tasks,
        required: false,
        attributes: []
      }],
      raw: true,
      attributes: {
        include: [
          [sequelize.literal('user.name'), 'name'],
          [sequelize.literal('user.last_name'), 'last_name'],
          [sequelize.literal('user.email'), 'email'],
          [sequelize.literal('task.description'), 'description']
        ]
      },
      order: [[sequelize.literal('user.name')], [sequelize.literal('user.last_name')], ['start_time', 'desc']]
    })
  } else {
    console.log("user call");
    // row = await models.getReport(dateRange, req.body.user_id);
    row = await db.entries.findAll({
      where: {
        user_id: req.userId,
        start_time: { [Op.between]: [start_time, end_time] },
        status: 1
      },
      include: [{
        model: db.users,
        attributes: []
      },
      {
        model: db.tasks,
        required: false,
        attributes: []
      }],
      raw: true,
      attributes: {
        include: [
          [sequelize.literal('user.name'), 'name'],
          [sequelize.literal('user.last_name'), 'last_name'],
          [sequelize.literal('user.email'), 'email'],
          [sequelize.literal('task.description'), 'description']
        ]
      },
      order: [[sequelize.literal('user.name')], ['start_time', 'desc']]
    })
  }

  // estilos
  var hdColumnStyle = workbook.createStyle({
    font: {
      name: "Arial",
      color: "#000000",
      size: 12,
      bold: true,
    },
    border: {
      right: {
        style: "medium",
        color: "#000000",
      },
    },
  });
  var contColumnStyle = workbook.createStyle({
    font: {
      name: "Arial",
      color: "#000000",
      size: 11,
    },
    border: {
      right: {
        style: "thin",
        color: "#000000",
      },
    },
  });
  // nombres columnas
  worksheet.cell(1, 1).string("User").style({
    font: {
      name: "Arial",
      color: "#000000",
      size: 12,
      bold: true,
    },
  });
  worksheet.cell(1, 2).style(hdColumnStyle);
  worksheet.cell(1, 3).string("Day").style(hdColumnStyle);
  worksheet.cell(1, 4).string("Date").style(hdColumnStyle);
  worksheet.cell(1, 5).string("Clock in").style(hdColumnStyle);
  worksheet.cell(1, 6).string("Clock out").style(hdColumnStyle);
  worksheet.cell(1, 7).string("Total Hours").style(hdColumnStyle);
  worksheet.cell(1, 8).string("Comments").style(hdColumnStyle);

  let i = 2;
  row.forEach((element) => {
    worksheet.cell(i, 1).string(element.name + " " + element.last_name).style({
      font: {
        name: "Arial",
        color: "#000000",
        size: 11,
      },
    })
    worksheet.cell(i, 2).style(contColumnStyle)

    worksheet
      .cell(i, 3)
      .string(moment(new Date(element.start_time)).utcOffset(-req.body.timezone).format('dddd'))
      .style(contColumnStyle);
    worksheet
      .cell(i, 4)
      .string(
        moment(new Date(element.start_time)).utcOffset(-req.body.timezone).format('YYYY-MM-DD')
      )
      .style(contColumnStyle);
    worksheet
      .cell(i, 5)
      .string(
        moment(new Date(element.start_time)).utcOffset(-req.body.timezone).format('HH:mm:ss')
      )
      .style(contColumnStyle);
    worksheet
      .cell(i, 6)
      .string(moment(new Date(element.end_time)).utcOffset(-req.body.timezone).format('HH:mm:ss'))
      .style(contColumnStyle);
    worksheet
      .cell(i, 7)
      .string(getTotalHours(element.start_time, element.end_time))
      .style(contColumnStyle);
    worksheet.cell(i, 8).string(element.description).style({
      font: {
        name: "Arial",
        color: "#000000",
        size: 12,
        bold: true,
      },
    });
    i++;
  });
  // ruta donde se guardara
  const xlPath = path.join(__dirname, "../../excel", nombreArchivo + ".xlsx");
  // escribir
  workbook.write(xlPath, (err, status) => {
    if (err) {
      console.error(err);
    } else {
      // function downloadFile(){res.download(xlPath)}
      // downloadFile()
      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      // res.setHeader('Content-Disposition', 'attachment; filename='+ nombreArchivo +'.xlsx');
      // res.setHeader('Content-Length', status.length);
      res.sendFile(xlPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          fs.unlink(xlPath, (err) => {
            if (err) {
              console.error("error");
            } else {
              console.log("eloo");
            }
          });
        }
      });
      // delete file

      // try {
      //     fs.unlinkSync(xlPath)
      // } catch (error) {
      //     console.error('error')
      // }

      // fs.rm(xlPath, function(err){
      //     if(err) console.error(err);
      //     else console.log('archivo eliminado')
      // });
    }
  });
  // worksheet.columns = [
  //     { header: 'Id', key: 'id', width: 10},
  //     { header: 'name', key: 'name', width: 32},
  //     { header: 'hours', key: 'hours', width: 10}
  // ]
  // workbook.eachSheet(function(worksheer, 1))
  // res.json('descargado')
};
// module.exports = {run: cronReport};

function getTotalHours(start_time, end_time) {
  const start = start_time.getTime();
  const endt = end_time.getTime();
  const diff = endt - start;
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return padZero(hours) + ":" + padZero(minutes) + ":" + padZero(seconds);
}

function padZero(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

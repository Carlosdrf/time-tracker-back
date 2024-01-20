import fetch from "node-fetch";
import models from "../models/Report";
import moment from "moment-timezone";
import * as format from "../services/utc.format";
import db from "../../models";
const Op = require("../../models").Sequelize.Op;
import * as roleModel from "../models/Role";
// import e from "express";

import fs from "fs";
import { where } from "sequelize";
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
  console.log('RANGE REPORT FUNCTION')
  console.log("end time: ",new Date(new Date(req.body.lastSelect).setHours(23, 59, 59)));
  const dateRange = {
    start_time: new Date(req.body.firstSelect),
    end_time: new Date(new Date(req.body.lastSelect).setHours(23, 59, 59))
  };
  // return;
  if (req.role == roleModel.ADMIN_ROLE && req.body.user_id == null) {
    const row = await models.getReport(dateRange);
    res.json(row);
  } else if (
    (req.role == roleModel.ADMIN_ROLE || req.role == roleModel.EMPLOYER_ROLE) &&
    req.body.user_id != null
  ) {
    const row = await models.getReport(dateRange, req.body.user_id);
    res.json(row);
  } else if (req.role == roleModel.EMPLOYER_ROLE && req.body.user_id == null) {
    const companies = await db.companies_users.findOne({
      where: { user_id: req.userId },
    });
    const employees = await db.employees.findAll({
      where: { company_id: companies.id },
    });
    console.log("employees: ", employees);
    const entries = await db.entries.findAll({
      where: { start_time: { [Op.between]: [start_time, end_time] } },
    });
    let users_entries;
    users_entries = entries.map((entry) => {
      let employee = employees.find(employee => entry.user_id === employee.user_id)
      entry[xd] = employee
      return entry
    });
    res.json(users_entries);
  } else {
    const row = await models.getReport(dateRange, req.userId);
    res.json(row);
  }
};
export const controller = async (req, res) => {
  console.log(req.body);
  const end_time = await format.UTCend(req.body.lastSelect);
  const start_time = await format.UTCStart(req.body.firstSelect);
  const dateRange = {
    start_time,
    end_time,
  };
  // res.json(test)
  // return 0
  const workbook = new excel.Workbook();
  let nombreArchivo = "report i-nimble";

  var worksheet = workbook.addWorksheet(nombreArchivo);
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
      // bold: true,
    },
    border: {
      right: {
        style: "thin",
        color: "#000000",
      },
    },
  });
  let row;
  if (req.role == 1 && req.body.user_id == null) {
    row = await models.getReport(dateRange);
  } else if (req.role == 1 && req.body.user_id !== null) {
    row = await models.getReport(dateRange, req.body.user_id);
  } else {
    console.log("client call");
    row = await models.getReport(dateRange, req.userId);
  }

  // nombres columnas
  worksheet.cell(1, 1).string("User").style(hdColumnStyle);
  // worksheet.cell(1,2).string('Apellido').style(hdColumnStyle)
  worksheet.cell(1, 3).string("Date").style(hdColumnStyle);
  worksheet.cell(1, 4).string("Start time").style(hdColumnStyle);
  worksheet.cell(1, 5).string("End time").style(hdColumnStyle);
  worksheet.cell(1, 6).string("Total Hours").style(hdColumnStyle);
  worksheet.cell(1, 7).string("Comments").style(hdColumnStyle);
  // worksheet.cell(2, 1).string(row[0].name + ' ' + row[0].last_name).style(contColumnStyle)

  let i = 2;
  let name;
  row.forEach((element) => {
    // worksheet.cell(i, 1).string(element.name).style(contColumnStyle)
    // worksheet.cell(i, 2).string(element.last_name).style(contColumnStyle)
    // worksheet.cell(i, 1).string(element.name+' '+element.last_name).style(contColumnStyle)
    if (name) {
      if (name !== element.name) {
        worksheet
          .cell(i, 1)
          .string(element.name + " " + element.last_name)
          .style(contColumnStyle);
      }
    } else {
      worksheet
        .cell(i, 1)
        .string(element.name + " " + element.last_name)
        .style(contColumnStyle);
    }
    const test = moment
      .tz(element.start_time, "America/Caracas")
      .format("HH:mm:ss");
    console.log(test);
    worksheet
      .cell(i, 2)
      .string(moment.tz(element.start_time, "America/Caracas").format("dddd"))
      .style(contColumnStyle);
    worksheet
      .cell(i, 3)
      .string(
        moment.tz(element.start_time, "America/Caracas").format("DD-MM-YYYY")
      )
      .style(contColumnStyle);
    worksheet
      .cell(i, 4)
      .string(
        moment.tz(element.start_time, "America/Caracas").format("HH:mm:ss")
      )
      .style(contColumnStyle);
    worksheet
      .cell(i, 5)
      .string(moment.tz(element.end_time, "America/Caracas").format("HH:mm:ss"))
      .style(contColumnStyle);
    worksheet
      .cell(i, 6)
      .string(getTotalHours(element.start_time, element.end_time))
      .style(contColumnStyle);
    worksheet.cell(i, 7).string(element.description).style(contColumnStyle);
    // console.log(element.name)
    name = element.name;
    i = i + 1;
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
      // console.log('archivo descargado')
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

import express from "express";
import { Server as webSocketServer } from "socket.io";
import { Stripe } from "stripe";
import http from "http";
import morgan from "morgan";
import entriesR from "./routes/entries.routes";
import authRoute from "./routes/auth.routes";
import reportRoute from "./routes/reports.routes";
import stripeRoute from "./routes/stripe.routes";
import userRoute from "./routes/users.routes";
import roleRoute from "./routes/roles.routes";
import companyRoute from "./routes/companies.routes";
import { createRoles, insertRoles } from "./libs/initialSetup";
import cors from "cors";
import * as cronReport from "./controllers/report.controller";
// const options = {
//   key: fs.readFileSync('certificate.key'),
//   cert: fs.readFileSync('certificate.crt'),
// }
const cron = require("node-cron");

// const {run: cronReport} = require('./controllers/report.controller')
// const stripe =
const app = express();
const server = http.createServer(app);
export const io = new webSocketServer(server, { cors: true, origins: ["*"] });

var userID;

io.on("connection", (socket) => {
  console.log("listening web socket");
  socket.on("client:joinRoom", (email) => {
    socket.join(email);
    userID = email;
    console.log("just joined, welcome ", email);
  });
  socket.on("client:timer", (data) => {
    console.log(userID);
    socket.broadcast.to(userID).emit("server:timer", data);
  });
  socket.on("client:loadEntries", (data) => {
    socket.broadcast.to(userID).emit("server:getEntries", data);
  });
  socket.on("client:closedEntry", (data) => {
    console.log("hello");
  });
});

// createRoles();
// insertRoles();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/stripe", stripeRoute);
app.use("/api/entries", entriesR);
app.use("/api/auth", authRoute);
app.use("/api/reports", reportRoute);
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/companies", companyRoute);
// cron.schedule('* * * * *', cronReport.report)

export default server;

import express from "express";
import { Server as webSocketServer } from "socket.io";
import http from "http";
import morgan from "morgan";
import entriesR from "./routes/entries.routes";
import authRoute from "./routes/auth.routes";
import reportRoute from "./routes/reports.routes";
import stripeRoute from "./routes/stripe.routes";
import userRoute from "./routes/users.routes";
import roleRoute from "./routes/roles.routes";
import companyRoute from "./routes/companies.routes";
import timezoneRoute from './routes/timezone.routes';
import { createRoles, insertRoles } from "./libs/initialSetup";
import cors from "cors";
// const options = {
//   key: fs.readFileSync('certificate.key'),
//   cert: fs.readFileSync('certificate.crt'),
// }
const cron = require("node-cron");

// const {run: cronReport} = require('./controllers/report.controller')
const app = express();
const server = http.createServer(app);
export const io = new webSocketServer(server, { cors: true, origins: ["*"] });

// exec socket.js functions
require('./socket')(io);

// createRoles();
// insertRoles();
app.use(cors());

app.use(morgan("dev"));
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf } }));
app.use("/api/stripe", stripeRoute);
app.use("/api/entries", entriesR);
app.use("/api/auth", authRoute);
app.use("/api/reports", reportRoute);
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/companies", companyRoute);
app.use("/api/timezones", timezoneRoute);
// cron.schedule('* * * * *', cronReport.report)

export default server;

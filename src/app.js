import express from "express";
import { Server as webSocketServer } from "socket.io";
import http from "http";
import morgan from "morgan";
import entriesRoutes from "./routes/entries.routes";
import authRoutes from "./routes/auth.routes";
import reportRoutes from "./routes/reports.routes";
import stripeRoutes from "./routes/stripe.routes";
import userRoutes from "./routes/users.routes";
import roleRoutes from "./routes/roles.routes";
import companyRoutes from "./routes/companies.routes";
import timezoneRoutes from "./routes/timezone.routes";
import positionRoutes from "./routes/positions.routes";
import notificationRoutes from './routes/notifications.routes'
import projectRoutes from "./routes/projects.routes";

import { createRoles, insertRoles } from "./libs/initialSetup";
import cors from "cors";

const routes = [
  { path: 'entries', router: entriesRoutes },
  { path: 'auth', router: authRoutes },
  { path: 'reports', router: reportRoutes },
  { path: 'stripe', router: stripeRoutes },
  { path: 'users', router: userRoutes },
  { path: 'roles', router: roleRoutes },
  { path: 'companies', router: companyRoutes },
  { path: 'timezones', router: timezoneRoutes },
  { path: 'positions', router: positionRoutes },
  { path: 'notifications', router: notificationRoutes },
  { path: 'projects', router: projectRoutes },
]
const cron = require("node-cron");

// const {run: cronReport} = require('./controllers/report.controller')
const app = express();
const server = http.createServer(app);
export const io = new webSocketServer(server, { cors: true, origins: ["*"] });

// exec socket.js functions
require("./socket")(io);

// createRoles();
// insertRoles();
app.use(cors());

app.use(morgan("dev"));
app.use(
  express.json()
);
routes.forEach(route => {
  app.use(`/api/${route.path}`, route.router)
})

export default server;

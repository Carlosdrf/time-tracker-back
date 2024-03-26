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
import { createRoles, insertRoles } from "./libs/initialSetup";
import cors from "cors";

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
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use("/api/stripe", stripeRoutes);
app.use("/api/entries", entriesRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/positions", positionRoutes);
app.use("/api/timezones", timezoneRoutes);
// cron.schedule('* * * * *', cronReport.report)

export default server;

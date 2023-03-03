import express from 'express'
import morgan from 'morgan'
import entriesR from './routes/entries.routes'
import authRoute from './routes/auth.routes'
import {createRoles} from './libs/initialSetup'
import cors from "cors";
// import cronReport from './controllers/report.cron'
const cron = require('node-cron')
const {run: cronReport} = require('./controllers/report.cron')

const app = express()
createRoles();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/entries', entriesR)
app.use('/api/auth', authRoute)
// cron.schedule('1 * * * *', cronReport)

export default app;

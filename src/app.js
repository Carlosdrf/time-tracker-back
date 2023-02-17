import express from 'express'
import morgan from 'morgan'
import entriesR from './routes/entries.routes'
import authRoute from './routes/auth.routes'
import {createRoles} from './libs/initialSetup'
import cors from "cors";
const app = express()
createRoles();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/entries', entriesR)
app.use('/api/auth', authRoute)


export default app;

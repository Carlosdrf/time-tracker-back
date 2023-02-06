import express from 'express'
import morgan from 'morgan'
import entriesR from './routes/products.routes'
import authRoute from './routes/auth.routes'
import {createRoles} from './libs/initialSetup'
const app = express()
createRoles();
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/entries', entriesR)
app.use('/api/auth', authRoute)


export default app;

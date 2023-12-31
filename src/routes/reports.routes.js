import { Router } from "express";
import {authJwt}  from "../middlewares";
import * as reportController from "../controllers/report.cron";
const router = Router()

router.post('/', authJwt.verifyToken, reportController.controller)
router.post('/entries', authJwt.verifyToken, reportController.getRange)


export default router;
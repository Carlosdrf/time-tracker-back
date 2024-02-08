import { Router } from "express";
import {authJwt}  from "../middlewares";
import * as reportController from "../controllers/report.controller";
const router = Router()

router.post('/', authJwt.verifyToken, reportController.getReport)
router.post('/entries', authJwt.verifyToken, reportController.getRange)


export default router;
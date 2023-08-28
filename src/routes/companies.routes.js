import Router from 'express'
const router = Router()
import { authJwt } from "../middlewares";
import * as companiesController from "../controllers/companies.controllers";

router.get('/', authJwt.verifyToken, companiesController.getCompanies)

module.exports = router
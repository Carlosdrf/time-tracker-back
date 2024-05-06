import Router from 'express'
const router = Router()
import { authJwt } from "../middlewares";
import * as companiesController from "../controllers/companies.controllers";

router.get('/', authJwt.verifyToken, companiesController.get)

router.post('/', authJwt.verifyToken, companiesController.create)

router.get('/:id/employees', authJwt.verifyToken, companiesController.getEmployees)

router.put('/:id', authJwt.verifyToken, companiesController.update)

router.delete('/:id', authJwt.verifyToken, companiesController.deleteCompany)

router.get('/possible', companiesController.getContacts)

router.post('/create/possible', companiesController.createPossibleClient)

module.exports = router
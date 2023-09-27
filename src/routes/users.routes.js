import { Router } from "express";
import { authJwt } from "../middlewares";
import * as userController from "../controllers/users.controller";
const router = Router()

router.post('/', authJwt.verifyToken, userController.getUsers)

router.post('/create', authJwt.verifyToken, userController.createUser)

router.get('/employees', authJwt.verifyToken, userController.getEmployees)

export default router;
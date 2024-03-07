import { Router } from "express";
import { authJwt } from "../middlewares";
import * as userController from "../controllers/users.controller";
const router = Router()

router.post('/', authJwt.verifyToken, userController.getUsers)

// router.get('/:id', authJwt.verifyToken, userController.getUserById)

router.post('/create', authJwt.verifyToken, userController.createUser)

router.put('/:id', authJwt.verifyToken, userController.updateUser)

router.delete('/:id', authJwt.verifyToken, userController.deleteUser)

router.get('/employees', authJwt.verifyToken, userController.getEmployees)

router.post('/verifyusername', authJwt.verifyToken, userController.verifyUsername)

export default router;
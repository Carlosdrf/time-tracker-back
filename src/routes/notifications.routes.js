import { Router } from "express";
import { authJwt } from '../middlewares'
import * as notificationController from '../controllers/notifications.controller'
const router = Router()

router.get('/', authJwt.verifyToken, notificationController.get)

router.get('/:id', authJwt.verifyToken, notificationController.get)

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], notificationController.create)

router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], notificationController.update)

router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], notificationController.deleteNotification)

router.get('/:id/user/:user_id', notificationController.get)

export default router
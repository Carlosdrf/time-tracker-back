import { Router } from "express";
const router = Router()
import * as authController from '../controllers/auth.controller'
import { checkUser} from '../middlewares'

router.post('/signup', checkUser.verifyUser ,authController.signUp)
router.post('/signin',authController.signin)

export default router
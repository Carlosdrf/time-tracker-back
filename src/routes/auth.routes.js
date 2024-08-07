import { Router } from "express";
const router = Router();
import * as authController from '../controllers/auth.controller';
import { checkUser, authJwt } from '../middlewares';

router.post('/signup/:code', [authJwt.validToken], authController.noResponse);

router.post('/signin', authController.signin);

router.post(
    '/generate',
    // authJwt.isAdmin,
    authController.generateUserCode,
);

router.post('/validate/:code', authController.validateHash);

export default router;
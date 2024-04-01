import { Router } from 'express'
import { authJwt } from "../middlewares";
import roleModel from "../services/Role";
const router = Router()

router.get('', authJwt.verifyToken, async (req, res) => {
    const roles = await roleModel.verifyRoleExists()
    res.json(roles)
})

export default router
import { Router } from "express";
import { authJwt } from "../middlewares";
const router = Router()

router.get('/', authJwt.verifyToken, async (req, res) => {
    try {
        const timezoneRes = await fetch('https://api.timezonedb.com/v2.1/list-time-zone?key=GZH10SMNDN81&format=json&country=US')
        const timezones = await timezoneRes.json()
        res.json(timezones)
    } catch (error) {
        res.status(400).json({message: 'could not find'})
    }

})

export default router;
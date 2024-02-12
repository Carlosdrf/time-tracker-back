import { Router } from "express";
import { authJwt } from "../middlewares";
const router = Router()

router.get('/', authJwt.verifyToken, async (req, res) => {
    const timezoneRes = await fetch('https://api.timezonedb.com/v2.1/list-time-zone?key=GZH10SMNDN81&format=json')
    const timezones = await timezoneRes.json()
    res.json(timezones)
})

export default router;
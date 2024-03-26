import { Router } from "express";
import { authJwt } from "../middlewares";
import * as positions from "../controllers/positions.controller";
const router = Router();

router.get("/", authJwt.verifyToken, positions.get);

router.post("/", authJwt.verifyToken, positions.create);

router.put("/:id", authJwt.verifyToken, positions.update);

export default router;

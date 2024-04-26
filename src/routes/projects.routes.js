import { Router } from "express";
import * as projectController from "../controllers/projects.controller";
import { authJwt } from "../middlewares";
const router = Router()

router.get("/", authJwt.verifyToken, projectController.get)

router.get("/:id", authJwt.verifyToken, projectController.get)

router.post("/", authJwt.verifyToken, projectController.create)

router.put("/:id", authJwt.verifyToken, projectController.update)

router.delete("/:id", [authJwt.verifyToken, authJwt.isEmployer], projectController.deleteProject)

export default router
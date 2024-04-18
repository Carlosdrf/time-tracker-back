import { Router } from "express";
const router = Router();
import * as entriesController from '../controllers/entries.controller'
import { authJwt, clock } from "../middlewares";

router.get('/', authJwt.verifyToken, entriesController.getEntries)

router.post('/', authJwt.verifyToken, entriesController.getEntries)

router.put('/closeEntry/:entryId', authJwt.verifyToken, entriesController.closeEntry)

router.post('/add', [authJwt.verifyToken, authJwt.isEmployee, clock.startedEntryExists], entriesController.createEntry)

router.put('/:entryId', [authJwt.verifyToken, authJwt.isAdmin], entriesController.updateEntryById)

router.put('/task/:task_id', [authJwt.verifyToken], entriesController.updateTaskById)

router.delete('/:id', [authJwt.verifyToken, authJwt.isEmployee], entriesController.deleteEntry)

export default router;
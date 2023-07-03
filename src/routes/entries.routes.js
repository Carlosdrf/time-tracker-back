import { Router } from "express";
const router = Router();
import * as entriesController from '../controllers/entries.controller'
import { authJwt } from "../middlewares";

router.get('/', authJwt.verifyToken, entriesController.getEntries)

router.post('/all', authJwt.verifyToken, entriesController.getAllEntries)

router.post('/user', authJwt.verifyToken, entriesController.getUsersEntries)

router.post('/users/status', authJwt.verifyToken, entriesController.getUserEntriesStatus)

// router.post('/users', authJwt.verifyToken, entriesController.getUsers)

router.get('/closeEntry/:entryId', authJwt.verifyToken, entriesController.closeEntry)

router.post('/', [authJwt.verifyToken, authJwt.isEmployee], entriesController.createEntry)

router.put('/:entryId', [authJwt.verifyToken, authJwt.isAdmin], entriesController.updateEntryById)

router.put('/task/:task_id', [authJwt.verifyToken], entriesController.updateTaskById)

router.delete('/:entryId',[authJwt.verifyToken, authJwt.isEmployee], entriesController.deleteProductById)

router.get('/started', authJwt.verifyToken, entriesController.getStartedEntry)

export default router;
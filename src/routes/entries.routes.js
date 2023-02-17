import { Router } from "express";
const router = Router();
import * as entriesController from '../controllers/entries.controller'
import { authJwt } from "../middlewares";

router.get('/', authJwt.verifyToken, entriesController.getEntries)

router.get('/closeEntry/:entryId', authJwt.verifyToken, entriesController.closeEntry)

router.post('/', [authJwt.verifyToken, authJwt.isEmployee], entriesController.createEntry)

router.put('/:entryId', [authJwt.verifyToken, authJwt.isEmployee], entriesController.updateEntryById)

router.delete('/:entryId',[authJwt.verifyToken, authJwt.isEmployee], entriesController.deleteProductById)

router.get('/started', authJwt.verifyToken, entriesController.getStartedEntry)

export default router;
import { Router } from "express";
const router = Router();
import * as productController from '../controllers/products.controller'
import { authJwt } from "../middlewares";

router.get('/', productController.getProducts)

router.get('/:entryId', productController.getProductById)

router.post('/', [authJwt.verifyToken, authJwt.isEmployee], productController.createProduct)

router.put('/:entryId', [authJwt.verifyToken, authJwt.isEmployee], productController.updateEntryById)

router.delete('/:entryId',[authJwt.verifyToken, authJwt.isEmployee], productController.deleteProductById)

export default router;
/**
 * Rutas de Productos
 */

import { Router } from "express";
import { getProducts } from "../controllers/product.controller";
import { createProduct } from "../controllers/product.controller";
import { updateProduct } from "../controllers/product.controller";
import { deactivateProduct } from "../controllers/product.controller";


const router = Router();

// GET /products
router.get("/", getProducts);

// POST /products
router.post("/", createProduct);

// PUT /products/:id
router.put("/:id", updateProduct);

router.delete("/:id", deactivateProduct);

export default router;

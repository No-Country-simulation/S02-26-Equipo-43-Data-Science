/**
 * Rutas de Ventas
 */

import { Router } from "express";
import { createSale } from "../controllers/sale.controller";

const router = Router();

// POST /sales
router.post("/", createSale);

export default router;

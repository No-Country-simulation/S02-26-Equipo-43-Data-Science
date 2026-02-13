/**
 * Controlador de Productos
 * Aquí vive la lógica de negocio
 */

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * GET /products
 * Devuelve todos los productos de una tienda
 * (por ahora usamos un storeId fijo para el MVP)
 */
export const getProducts = async (_req: Request, res: Response) => {
  try {
    // ⚠️ MVP: luego vendrá del usuario autenticado
    const STORE_ID = "demo-store-id";

    const products = await prisma.product.findMany({
      where: {
        storeId: STORE_ID,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    res.status(500).json({
      message: "Error al obtener productos",
    });
  }
};


export const createProduct = async (req: Request, res: Response) => {
  try {
    const STORE_ID = "demo-store-id";

    const { name, category, cost, price, stock } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "name y category son requeridos" });
    }

    const product = await prisma.product.create({
      data: {
        storeId: STORE_ID,
        name,
        category,
        cost: cost ?? 0,
        price: price ?? 0,
        stock: stock ?? 0,
      },
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creando producto:", error);
    return res.status(500).json({ message: "Error al crear producto" });
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, cost, price, stock, isActive } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        category,
        cost,
        price,
        stock,
        isActive,
      },
    });

    return res.json(product);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    return res.status(500).json({ message: "Error al actualizar producto" });
  }
};


export const deactivateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return res.json(product);
  } catch (error) {
    console.error("Error desactivando producto:", error);
    return res.status(500).json({ message: "Error al desactivar producto" });
  }
};

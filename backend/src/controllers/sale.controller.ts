/**
 * Controlador de Ventas
 * - Crea una venta con sus items
 * - Descuenta stock de productos
 * - Usa transacción para que todo sea atómico (o se guarda todo o nada)
 */

import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

type CreateSaleBody = {
  customerId?: string | null;
  items: Array<{
    productId: string;
    qty: number;
  }>;
};

export const createSale = async (req: Request, res: Response) => {
  try {
    const STORE_ID = "demo-store-id"; // MVP: luego vendrá del usuario autenticado

    const body = req.body as CreateSaleBody;

    // Validación mínima (MVP)
    if (!body?.items || !Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ message: "items es requerido y no puede estar vacío" });
    }

    // 1) Obtener productos y validar stock
    const productIds = body.items.map((i) => i.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, storeId: STORE_ID, isActive: true },
    });

    // Map para acceder rápido por id
    const productMap = new Map(products.map((p) => [p.id, p]));

    for (const item of body.items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Producto no encontrado: ${item.productId}` });
      }

      if (!Number.isInteger(item.qty) || item.qty <= 0) {
        return res.status(400).json({ message: `qty inválido para producto ${item.productId}` });
      }

      if (product.stock < item.qty) {
        return res.status(409).json({
          message: `Stock insuficiente para ${product.name}`,
          productId: product.id,
          available: product.stock,
          requested: item.qty,
        });
      }
    }

    // 2) Crear venta + items + actualizar stock (TRANSACCIÓN)
    const result = await prisma.$transaction(async (tx) => {
      // Calcular totales usando el precio actual del producto
      const itemsWithPrices = body.items.map((i) => {
        const p = productMap.get(i.productId)!;
        const unitPrice = p.price;
        const lineTotal = Number(unitPrice) * i.qty;

        return {
          productId: p.id,
          qty: i.qty,
          unitPrice, // Prisma Decimal acepta number
          lineTotal, // Prisma Decimal acepta number
        };
      });

      const total = itemsWithPrices.reduce((acc, it) => acc + Number(it.lineTotal), 0);

      // Crear Sale
      const sale = await tx.sale.create({
        data: {
          storeId: STORE_ID,
          customerId: body.customerId ?? null,
          total,
          items: {
            create: itemsWithPrices,
          },
        },
        include: {
          items: true,
        },
      });

      // Descontar stock por producto
      for (const it of body.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: {
            stock: { decrement: it.qty },
          },
        });
      }

      return sale;
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error creando venta:", error);
    return res.status(500).json({ message: "Error al crear venta" });
  }
};

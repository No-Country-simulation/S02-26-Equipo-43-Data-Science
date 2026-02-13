import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const STORE_ID = "demo-store-id";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ventas totales y de hoy
    const totalSales = await prisma.sale.aggregate({
      where: { storeId: STORE_ID },
      _sum: { total: true },
      _count: { _all: true },
    });

    const todaySales = await prisma.sale.aggregate({
      where: { storeId: STORE_ID, soldAt: { gte: today } },
      _sum: { total: true },
      _count: { _all: true },
    });

    const todaySalesAmount = totalToNumber(todaySales._sum.total);
    const todaySalesCount = todaySales._count._all ?? 0;
    const avgTicketToday = todaySalesCount > 0 ? todaySalesAmount / todaySalesCount : 0;

    // Productos activos y bajo stock
    const activeProducts = await prisma.product.count({
      where: { storeId: STORE_ID, isActive: true },
    });

    const lowStockProducts = await prisma.product.count({
      where: { storeId: STORE_ID, isActive: true, stock: { lt: 10 } },
    });

    // Top productos vendidos hoy
    const topItems = await prisma.saleItem.groupBy({
      by: ["productId"],
      where: {
        sale: {
          storeId: STORE_ID,
          soldAt: { gte: today },
        },
      },
      _sum: { qty: true },
      orderBy: { _sum: { qty: "desc" } },
      take: 5,
    });

    const topProductIds = topItems.map((t) => t.productId);

    const topProducts = await prisma.product.findMany({
      where: { id: { in: topProductIds } },
      select: { id: true, name: true, category: true },
    });

    const productNameMap = new Map(topProducts.map((p) => [p.id, p]));

    const topProductsToday = topItems.map((t) => {
      const p = productNameMap.get(t.productId);
      return {
        productId: t.productId,
        name: p?.name ?? "Unknown",
        category: p?.category ?? null,
        qtySold: t._sum.qty ?? 0,
      };
    });

    // Margen bruto (hoy y total)
    // Traemos items con precio unitario y qty, y el costo del producto
    const todayItems = await prisma.saleItem.findMany({
      where: {
        sale: {
          storeId: STORE_ID,
          soldAt: { gte: today },
        },
      },
      select: {
        qty: true,
        unitPrice: true,
        product: { select: { cost: true } },
      },
    });

    const allItems = await prisma.saleItem.findMany({
      where: {
        sale: { storeId: STORE_ID },
      },
      select: {
        qty: true,
        unitPrice: true,
        product: { select: { cost: true } },
      },
    });

    const grossProfitToday = calcGrossProfit(todayItems);
    const grossProfitTotal = calcGrossProfit(allItems);

    return res.json({
      totalSalesAmount: totalToNumber(totalSales._sum.total),
      totalSalesCount: totalSales._count._all ?? 0,

      todaySalesAmount,
      todaySalesCount,
      avgTicketToday,

      activeProducts,
      lowStockProducts,
      topProductsToday,

      grossProfitToday,
      grossProfitTotal,
    });
  } catch (error) {
    console.error("Error dashboard:", error);
    return res.status(500).json({ message: "Error obteniendo dashboard" });
  }
};

// Helpers
function totalToNumber(value: any): number {
  // Prisma Decimal a veces viene como string/Decimal; Number() lo maneja bien
  return value ? Number(value) : 0;
}

function calcGrossProfit(
  items: Array<{ qty: number; unitPrice: any; product: { cost: any } }>
): number {
  let profit = 0;

  for (const it of items) {
    const unitPrice = Number(it.unitPrice ?? 0);
    const cost = Number(it.product?.cost ?? 0);
    profit += (unitPrice - cost) * it.qty;
  }

  return profit;
}

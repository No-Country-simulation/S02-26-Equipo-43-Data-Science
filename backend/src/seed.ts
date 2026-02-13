/**
 * Seed inicial para el MVP
 * Crea una tienda y productos de ejemplo
 */

import { prisma } from "./lib/prisma";

async function main() {
  // Crear tienda demo
  const store = await prisma.store.upsert({
    where: { id: "demo-store-id" },
    update: {},
    create: {
      id: "demo-store-id",
      name: "Tienda Demo DATAMARK",
      city: "Lima",
    },
  });

  // Crear productos demo
  await prisma.product.createMany({
    data: [
      {
        storeId: store.id,
        name: "Zapatillas Urbanas",
        category: "Calzado",
        cost: 120,
        price: 220,
        stock: 15,
      },
      {
        storeId: store.id,
        name: "Polo Básico",
        category: "Ropa",
        cost: 25,
        price: 60,
        stock: 40,
      },
    ],
    skipDuplicates: true,
  });

  console.log("🌱 Seed ejecutado correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

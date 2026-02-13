# DATAMARK – Documentación Técnica 

**Estado del proyecto:** MVP – Backend funcional 
**Tipo:** API REST (stateless)  
**Formato de respuesta:** JSON  
**Base URL (local):** `http://localhost:3000`

---

## 1. Resumen ejecutivo

**DATAMARK** es una solución **B2B SaaS** (MVP) para centralizar y automatizar **ventas** e **inventarios** de pequeños negocios de **ropa y calzado**.

Este backend implementa:

- Gestión de productos e inventario
- Registro de ventas con transacciones atómicas
- Validación y descuento automático de stock
- Cálculo de KPIs comerciales
- Endpoints agregados para dashboard

La arquitectura es modular y preparada para evolucionar a: **autenticación**, **multi-tenant**, **testing automatizado** y **CI/CD**.

---

## 2. Alcance del MVP

###  Implementado

- CRUD de productos
- Registro de ventas con integridad transaccional (atomicidad)
- Validación de stock y decremento automático
- Métricas agregadas para dashboard
- PostgreSQL 15 dockerizado
- Arquitectura por capas (Routes → Controllers → Data Layer/ORM)
- Contrato API listo para frontend

###  Pendiente (roadmap)

- Integración con frontend
- Autenticación + roles (JWT / RBAC)
- Multi-tenant (aislamiento por tienda)
- Pruebas (Jest / Cypress)
- CI/CD (Jenkins)
- Estrategia de despliegue productivo

---

## 3. Arquitectura del sistema

```text
Cliente (Frontend – pendiente)
        ↓
Express Routes
        ↓
Controllers (lógica de negocio)
        ↓
Prisma ORM
        ↓
PostgreSQL (Docker)

```


### Características clave

- API REST **sin estado**
- Procesamiento de ventas **transaction-safe**
- Separación de responsabilidades (SoC)
- Abstracción de base de datos mediante ORM (Prisma)
- Infraestructura contenerizada (Docker)
- Diseño preparado para escalar horizontalmente

---

## 4. Stack tecnológico

### Backend
- Node.js
- TypeScript
- Express.js
- Prisma ORM

### Base de datos
- PostgreSQL 15
- Docker / Docker Compose

### Desarrollo
- ts-node-dev
- npm
- curl (pruebas manuales)

---

## 5. Modelo de datos (alto nivel)

> Nota: Los nombres de entidades pueden variar según el schema real de Prisma; esta sección describe el modelo lógico.

### Producto (`Product`)
- `id` (UUID)
- `name`
- `category`
- `cost`
- `price`
- `stock`
- `isActive`
- `createdAt`
- `updatedAt`

### Venta (`Sale`)
- `id` (UUID)
- `storeId` *(preparado para multi-tenant)*
- `total`
- `soldAt`
- `createdAt`
- `updatedAt`

### Detalle de venta (`SaleItem`)
- `id` (UUID)
- `saleId`
- `productId`
- `qty`
- `unitPrice`
- `lineTotal`

---

## 6. Reglas de negocio

- Cada venta se procesa dentro de una **transacción**.
- Se valida stock **antes** de confirmar la venta.
- El stock se descuenta **automáticamente** cuando la venta se confirma.
- Las métricas del dashboard se calculan desde ventas persistidas.
- Utilidad bruta (gross profit) por línea:

```text

(unitPrice - cost) × qty

```

---

## 7. Convenciones de datos

### 7.1 Convención de campos
- IDs: UUID
- Claves JSON: `camelCase`
- **Campo oficial en ventas:** `productId`


### 7.2 Moneda y decimales
- `cost` y `price` se manejan como número (recomendado: **2 decimales**).
- Para producción se recomienda almacenar dinero como **enteros en centavos** o `Decimal` (según ORM/DB) para evitar errores de redondeo.

### 7.3 Fechas
- `soldAt`, `createdAt`, `updatedAt`: ISO-8601 (UTC recomendado)

---

## 8. Variables de entorno

Crea un archivo `.env` (o usa variables del sistema). Ejemplo:


### Server

```bash
PORT=3000
NODE_ENV=development
```

### Prisma / DB

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/datamark?schema=public"
```
- Si usas Docker Compose, DATABASE_URL debe apuntar al hostname del servicio (ej. db) según tu docker-compose.yml.

------

## 9. Especificación de API

### 9.1 Health Check

GET /health

Verifica disponibilidad del servicio.

200 OK

```bash
{
  "status": "ok",
  "service": "datamark-backend",
  "timestamp": "2026-02-12T00:00:00.000Z"
}
```
### 9.2 Módulo Productos

Listar productos activos

GET /products

200 OK
```bash
[
  {
    "id": "uuid",
    "name": "Gorra Negra",
    "category": "Accesorios",
    "cost": 18,
    "price": 45,
    "stock": 12,
    "isActive": true
  }
]
```

Crear producto

POST /products

Body

```bash
{
  "name": "Gorra Negra",
  "category": "Accesorios",
  "cost": 18,
  "price": 45,
  "stock": 12
}
```
- 201 Created (ejemplo)
```
{
  "id": "uuid",
  "name": "Gorra Negra",
  "category": "Accesorios",
  "cost": 18,
  "price": 45,
  "stock": 12,
  "isActive": true,
  "createdAt": "2026-02-12T00:00:00.000Z"
}
```

- 400 Bad Request (validación)

```
{ "message": "Datos inválidos: name es requerido" }
```

Actualizar producto (parcial)

PUT /products/:id

Body (ejemplo)

```
{
  "price": 50
}
```

- 200 OK

```
{
  "id": "uuid",
  "price": 50,
  "updatedAt": "2026-02-12T00:00:00.000Z"
}
```

- 404 Not Found

```
{ "message": "Producto no encontrado" }
```

### 9.3 Módulo Ventas

Crear venta

POST /sales

Body
```
{
  "items": [
    { "productId": "UUID_DEL_PRODUCTO", "qty": 2 }
  ]
}
```

**Comportamiento del sistema**

- Valida disponibilidad de stock

- Si el stock es insuficiente, rechaza la venta

- Ejecuta operación como transacción atómica

- Descuenta inventario automáticamente

- Persiste Sale y SaleItems

- Calcula total y utilidad bruta

- 201 Created (ejemplo)

```
{
  "id": "uuid_sale",
  "total": 90,
  "soldAt": "2026-02-12T00:00:00.000Z",
  "items": [
    {
      "productId": "uuid_product",
      "qty": 2,
      "unitPrice": 45,
      "lineTotal": 90
    }
  ]
}
```
- 409 Conflict (stock insuficiente)

```
{
  "message": "Stock insuficiente para el producto",
  "productId": "UUID",
  "available": 13,
  "requested": 50
}
```

- 404 Not Found (producto inexistente)

```
{ "message": "Producto no encontrado" }
```

### 9.4 Módulo Dashboard

Resumen general

GET /dashboard/summary

200 OK (ejemplo)

```
{
  "totalSalesAmount": 12500,
  "totalSalesCount": 210,
  "todaySalesAmount": 850,
  "todaySalesCount": 12,
  "avgTicketToday": 70.83,
  "activeProducts": 95,
  "lowStockProducts": 7,
  "topProductsToday": [
    { "productId": "uuid", "name": "Tenis X", "qty": 4, "amount": 800 }
  ],
  "grossProfitToday": 320,
  "grossProfitTotal": 4500
}
```

----

## 10. Manejo de errores

Formato estándar

```
{ "message": "Descripción del error" }
```

**Errores comunes**

- Stock insuficiente

- Producto no encontrado

- Error de conexión a base de datos

- Error interno del servidor

Recomendación: agregar code (ej. INSUFFICIENT_STOCK) en futuras iteraciones para facilitar manejo en frontend.


----

## 11. Instalación y ejecución (local)

1) Instalar dependencias

```
npm install
```

2) Levantar base de datos (Docker)

```
docker compose up -d
```

3) Migraciones

```
npx prisma migrate dev
```

4) Generar Prisma Client

```
npx prisma generate
```

5) Iniciar servidor

```
npm run dev
```

-----

## 12. Pruebas manuales rápidas (curl)

Health

```
curl -s http://localhost:3000/health
```

Crear producto

```
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gorra Negra","category":"Accesorios","cost":18,"price":45,"stock":12}'
```

Listar productos

```
curl -s http://localhost:3000/products
```


Crear venta

```
curl -s -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"UUID_DEL_PRODUCTO","qty":2}]}'
```

Dashboard summary

```
curl -s http://localhost:3000/dashboard/summary
```
------

## 13. Seguridad (estado actual)

En el MVP actual:

- Sin autenticación

- Sin control de roles

- Sin multi-tenant productivo (store isolation)

- Sin rate limiting

- Exposición local para desarrollo

Antes de producción: implementar JWT/RBAC, validación de payloads, rate limiting, logging estructurado y hardening de infraestructura.

----------

## 14. Próximas mejoras (roadmap)

- Unit testing (Jest)

- Integration testing

- E2E testing (Cypress)

- CI/CD (Jenkins)

- Autenticación (JWT)

- RBAC (roles/permisos)

- Multi-tenant real (aislamiento por tienda)

- Logging estructurado + monitoreo (observabilidad)

---------

## 15. Nivel de madurez

Este backend es una base sólida de MVP, con:

- Arquitectura modular y escalable

- Operaciones transaccionales seguras

- Modelo de datos preparado para expansión

- Contrato API claro para frontend

- Extensibilidad a features enterprise

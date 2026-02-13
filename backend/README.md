# DATAMARK – Documentación Técnica (Backend)

**Estado del proyecto:** MVP – Backend funcional ✅ | Integración con Frontend (en construcción) ⏳  
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

### ✅ Implementado

- CRUD de productos  
- Registro de ventas con integridad transaccional (atomicidad)  
- Validación de stock y decremento automático  
- Métricas agregadas para dashboard  
- PostgreSQL 15 dockerizado  
- Arquitectura por capas (Routes → Controllers → Data Layer/ORM)  
- Contrato API listo para frontend  

### ⏳ Pendiente (roadmap)

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

- API REST sin estado  
- Procesamiento de ventas transaction-safe  
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

### Producto (Product)

- id (UUID)  
- name  
- category  
- cost  
- price  
- stock  
- isActive  
- createdAt  
- updatedAt  

### Venta (Sale)

- id (UUID)  
- storeId (preparado para multi-tenant)  
- total  
- soldAt  
- createdAt  
- updatedAt  

### Detalle de venta (SaleItem)

- id (UUID)  
- saleId  
- productId  
- qty  
- unitPrice  
- lineTotal  

---

## 6. Reglas de negocio

- Cada venta se procesa dentro de una transacción.  
- Se valida stock antes de confirmar la venta.  
- El stock se descuenta automáticamente cuando la venta se confirma.  
- Las métricas del dashboard se calculan desde ventas persistidas.  

### Utilidad bruta (gross profit) por línea:

```text
(unitPrice - cost) × qty
```

---

## 7. Convenciones de datos

### 7.1 Convención de campos

- IDs: UUID  
- Claves JSON: camelCase  
- Campo oficial en ventas: productId  

### 7.2 Moneda y decimales

- cost y price se manejan como número (recomendado: 2 decimales).  
- Para producción se recomienda almacenar dinero como enteros en centavos o Decimal (según ORM/DB) para evitar errores de redondeo.  

### 7.3 Fechas

- soldAt, createdAt, updatedAt: ISO-8601 (UTC recomendado)  

---

## 8. Variables de entorno

> Se manejan variables en dos niveles:
>
> - Raíz del repo (Docker Compose)  
> - Carpeta backend/ (Node/Prisma)  

### 8.1 Variables para Docker Compose (raíz del repositorio)

Crear archivo local `./.env` basado en `./.env.example`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=datamark
POSTGRES_PORT=5432
```

`./.env.example` sí se sube a GitHub como plantilla.

---

### 8.2 Variables para el Backend (dentro de backend/)

Crear archivo local `backend/.env` basado en `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/datamark?schema=public"
```

`backend/.env.example` sí se sube a GitHub como plantilla.

---

## 9. Especificación de API

### 9.1 Health Check

#### `GET /health`

```json
{
  "status": "ok",
  "service": "datamark-backend",
  "timestamp": "2026-02-12T00:00:00.000Z"
}
```

---

### 9.2 Módulo Productos

#### `GET /products`

```json
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

---

#### `POST /products`

```json
{
  "name": "Gorra Negra",
  "category": "Accesorios",
  "cost": 18,
  "price": 45,
  "stock": 12
}
```

**201 Created**

```json
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

**400 Bad Request**

```json
{ "message": "Datos inválidos: name es requerido" }
```

---

#### `PUT /products/:id`

```json
{
  "price": 50
}
```

**200 OK**

```json
{
  "id": "uuid",
  "price": 50,
  "updatedAt": "2026-02-12T00:00:00.000Z"
}
```

**404 Not Found**

```json
{ "message": "Producto no encontrado" }
```

---

### 9.3 Módulo Ventas

#### `POST /sales`

```json
{
  "items": [
    { "productId": "UUID_DEL_PRODUCTO", "qty": 2 }
  ]
}
```

**201 Created**

```json
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

**409 Conflict**

```json
{
  "message": "Stock insuficiente para el producto",
  "productId": "UUID",
  "available": 13,
  "requested": 50
}
```

**404 Not Found**

```json
{ "message": "Producto no encontrado" }
```

---

### 9.4 Módulo Dashboard

#### `GET /dashboard/summary`

```json
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

---

## 10. Manejo de errores

Formato estándar:

```json
{ "message": "Descripción del error" }
```

Errores comunes:

- Stock insuficiente  
- Producto no encontrado  
- Error de conexión a base de datos  
- Error interno del servidor  

---

## 11. Instalación y ejecución (local)

### 1️⃣ Levantar PostgreSQL (desde la raíz)

```bash
docker compose up -d
```

---

### 2️⃣ Configurar backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## 12. Pruebas manuales rápidas (curl)

### Health

```bash
curl -s http://localhost:3000/health
```

### Crear producto

```bash
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Gorra Negra","category":"Accesorios","cost":18,"price":45,"stock":12}'
```

### Listar productos

```bash
curl -s http://localhost:3000/products
```

### Crear venta

```bash
curl -s -X POST http://localhost:3000/sales \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"UUID_DEL_PRODUCTO","qty":2}]}'
```

### Dashboard

```bash
curl -s http://localhost:3000/dashboard/summary
```

---

## 13. Seguridad (estado actual)

- Sin autenticación  
- Sin control de roles  
- Sin multi-tenant productivo  
- Sin rate limiting  
- Exposición local para desarrollo  

---

## 14. Próximas mejoras (roadmap)

- Unit testing (Jest)  
- Integration testing  
- E2E testing (Cypress)  
- CI/CD (Jenkins)  
- Autenticación (JWT)  
- RBAC (roles/permisos)  
- Multi-tenant real  
- Logging estructurado + monitoreo  

---

## 15. Nivel de madurez

Backend MVP con:

- Arquitectura modular y escalable  
- Operaciones transaccionales seguras  
- Modelo de datos preparado para expansión  
- Contrato API claro para frontend  
- Extensibilidad a features enterprise  

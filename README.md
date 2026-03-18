# 🏬 DATAMARK – MVP B2B SaaS Retail Analytics Platform

🌐 **Aplicación en Producción (Frontend):**  
https://datamark-app.vercel.app

🔗 **API Backend (Producción):**  
https://datamark-api.onrender.com

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Backend](https://img.shields.io/badge/backend-Node.js_+_Express-green)
![Database](https://img.shields.io/badge/database-PostgreSQL-blue)
![ORM](https://img.shields.io/badge/ORM-Prisma-black)
![Frontend](https://img.shields.io/badge/frontend-React_+_Vite-purple)
![Container](https://img.shields.io/badge/docker-enabled-blue)

---

## 📙 Descripción del Proyecto

**DATAMARK** es una plataforma **B2B SaaS en etapa MVP** diseñada para pequeños negocios de **ropa y calzado en provincias del Perú**, cuyo objetivo es centralizar:

- Ventas  
- Inventario  
- Productos  
- Métricas comerciales  

El sistema permite reducir errores manuales, mejorar el control operativo y habilitar decisiones basadas en datos mediante dashboards intuitivos.

---

## 🌳 Problemática

Muchos negocios minoristas gestionan:

- Inventario en cuadernos o Excel desordenados  
- Ventas sin trazabilidad  
- Sin métricas de rentabilidad  
- Sin control de stock bajo  

Esto genera:

- Pérdidas económicas  
- Errores humanos  
- Decisiones sin respaldo analítico  
- Falta de visibilidad del negocio  

---

## 🎯 Objetivo del MVP

Desarrollar una solución web que permita:

- Registrar productos  
- Registrar ventas con validación de stock  
- Calcular KPIs automáticamente  
- Visualizar métricas en un dashboard profesional  
- Mantener arquitectura preparada para escalar a ML predictivo  

---

## 📋 Alcance Funcional

### ✅ Implementado

- CRUD de productos  
- Registro de ventas con integridad transaccional  
- Validación automática de stock  
- Cálculo de utilidad bruta  
- KPIs agregados para dashboard  
- Base de datos PostgreSQL dockerizada  
- Arquitectura modular desacoplada  
- Manejo de errores centralizado  

### 🚧 Próximas Iteraciones

- Autenticación multi-tenant  
- Microservicio de Machine Learning  
- Predicción de ventas  
- Recomendación de reposición de stock  

---

## 🏗️ Arquitectura General

| Componente | Tecnología |
|------------|------------|
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma |
| Base de Datos | PostgreSQL 15 (Docker) |
| Frontend | React + Vite |
| API | REST (JSON) |
| Contenerización | Docker + Docker Compose |

---

## 🧱 Arquitectura de Integración

```
Controller
    ↓
Service
    ↓
Repository (Prisma)
    ↓
PostgreSQL
```

Principios:

- Controller sin lógica de negocio  
- Service con lógica transaccional  
- Prisma como capa de acceso a datos  
- Middleware global de errores  
- Preparado para integración con microservicio ML  

---

## 🗄️ Modelo de Datos (ERD Simplificado)

### Product

```json
{
  "id": "uuid",
  "storeId": "string",
  "name": "string",
  "sku": "string | null",
  "barcode": "string | null",
  "category": "string",
  "cost": "decimal",
  "price": "decimal",
  "stock": "int",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Sale

```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": "int",
  "totalAmount": "decimal",
  "createdAt": "datetime"
}
```

---

## 🔌 Contrato de API

### Base URL (local)

```
http://localhost:3000
```

### GET `/health`

### POST `/api/products`

### GET `/api/products`

### POST `/api/sales`

### GET `/api/dashboard/summary`

---

## 📊 Dashboard & KPIs

Indicadores implementados:

- Ventas totales  
- Ventas del día  
- Ticket promedio  
- Productos activos  
- Productos con bajo stock  
- Utilidad bruta  
- Top productos vendidos  

---

## 🛡️ Manejo de Errores

```json
{
  "status": "ERROR",
  "message": "Stock insuficiente"
}
```

---

## 🧪 Pruebas Realizadas

- Pruebas manuales con Thunder Client  
- Validación de endpoints  
- Validación de integridad transaccional  
- Validación de KPIs  

---

## 🚀 Cómo Levantar el Entorno

```bash
git clone https://github.com/No-Country-simulation/S02-26-Equipo-43-Data-Science.git
cd S02-26-Equipo-43-Data-Science
docker-compose up -d
cd backend
npm install
npx prisma migrate dev
npm run dev
cd ../frontend
npm install
npm run dev
```

---

## 📂  Diagramas

Arquitectura:  
https://github.com/No-Country-simulation/S02-26-Equipo-43-Data-Science/blob/main/docs/architecture.mmd  

ERD:  
https://github.com/No-Country-simulation/S02-26-Equipo-43-Data-Science/blob/main/docs/erd.mmd  

---

## 👨‍💻 Equipo

| Rol | Área |
|------|------|
| Backend Developer | API REST + Prisma |
| Frontend Developer | React + Dashboard |
| Data Science | Modelo Predictivo (Iteración futura) |

Desarrollado:

[<img src="https://avatars.githubusercontent.com/u/160809137?s=400&u=53819c9e0bceb756b1c959b51623021829b0f8ae&v=4" width=115><br><sub>Angeles Morales</sub>](https://github.com/angelesGladin) 
---

## 📜 Licencia

MIT License

---

# 🚀 DATAMARK

MVP B2B SaaS para retail inteligente basado en datos.  
Preparado para evolucionar hacia arquitectura multi-tenant y analítica predictiva.

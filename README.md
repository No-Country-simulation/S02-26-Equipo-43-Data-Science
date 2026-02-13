# 📊 Proyecto B2B – DATAMARK 

##  Objetivo del Proyecto

Desarrollar un **MVP B2B SaaS** llamado **DATAMARK**, orientado a pequeños negocios de **ropa y calzado**, con el propósito de:

- Centralizar ventas e inventarios  
- Reducir errores manuales  
- Automatizar control de stock  
- Proveer métricas claras para toma de decisiones  

---

##  1. Diseño de Arquitectura

Se definió una arquitectura modular y escalable basada en:

```text
Frontend (en construcción)
        ↓
Backend (Express + TypeScript)
        ↓
Prisma ORM
        ↓
PostgreSQL (Docker)
```

###  Diagramas del Sistema

Los diagramas oficiales del proyecto se encuentran en la carpeta `/docs`:

```text
/docs/architecture.mmd
/docs/erd.mmd
```

Estos diagramas describen:

- Arquitectura general del sistema
- Relaciones entre entidades (Entity Relationship Diagram)
- Modelo de datos del MVP

### Decisiones clave

- API REST stateless  
- Arquitectura por capas (Routes → Controllers → ORM)  
- Procesamiento de ventas con transacciones atómicas  
- Infraestructura dockerizada  
- Base preparada para multi-tenant  

---

##  2. Desarrollo del Backend MVP

Se construyó una API funcional con:

###  Gestión de Productos

- CRUD completo  
- Validaciones de datos  
- Control de stock  
- Soft delete (`isActive`)  

###  Registro de Ventas

- Validación de disponibilidad de stock  
- Descuento automático de inventario  
- Persistencia de venta + detalle de venta  
- Procesamiento transaccional (atomicidad)  

###  Dashboard Comercial

Endpoint agregado que calcula:

- Ventas totales  
- Ventas del día  
- Ticket promedio  
- Productos activos  
- Productos con bajo stock  
- Top productos  
- Utilidad bruta total y diaria  

---

##  3. Reglas de Negocio Implementadas

- Toda venta se ejecuta dentro de una transacción  
- No se permite vender si no hay stock suficiente  
- El inventario se descuenta automáticamente  
- La utilidad se calcula por línea:

```text
(unitPrice - cost) × qty
```

---

##  4. Infraestructura

- PostgreSQL 15 dockerizado  
- Variables de entorno separadas:
  - Raíz del proyecto (Docker)  
  - Carpeta backend (Node/Prisma)  
- Prisma ORM como capa de abstracción  
- Migraciones controladas con Prisma  

---

##  5. API Contract Lista para Frontend

Endpoints implementados:

```text
GET /health
GET /products
POST /products
PUT /products/:id
POST /sales
GET /dashboard/summary
```

La API responde en **JSON** con estructura consistente y manejo de errores estandarizado.

---

##  6. Testing Manual

Se definieron pruebas rápidas usando `curl` para:

- Crear productos  
- Listar productos  
- Generar ventas  
- Consultar dashboard  
- Validar errores de stock  

---

##  7. Estado Actual

### 🟢 Backend

Funcional como MVP sólido, modular y escalable.

### 🟡 Frontend

En construcción.

### 🔴 Aún pendiente

- Autenticación (JWT)  
- RBAC  
- Multi-tenant real  
- Testing automatizado (Jest, Cypress)  
- CI/CD (Jenkins)  
- Hardening para producción  

---

##  Nivel de Madurez

El proyecto ya cuenta con:

- Arquitectura limpia y profesional  
- Lógica de negocio realista  
- Integridad transaccional  
- Modelo de datos documentado (ERD)  
- Base preparada para escalar  
- Contrato API listo para integración  

---

##  Visión Estratégica

**DATAMARK** ya no es solo un ejercicio técnico.  
Es una base sólida de:

- Producto SaaS B2B  
- Plataforma escalable  
- Sistema listo para evolucionar a producción  
- Proyecto con potencial comercial real  

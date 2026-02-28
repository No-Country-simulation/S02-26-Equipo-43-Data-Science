DATAMARK - Backend

Backend oficial de DATAMARK, la plataforma de análisis y procesamiento de datos

Descripción general

El backend de DATAMARK es una API RESTful encargada de:

-Procesamiento estadístico.
-Consolidación de múltiples fuentes de datos.
-Limpieza y transformación de conjuntos de datos.
-Cálculo de métricas descriptivas.
-Exposición de endpoints para el frontend.
-Gestión de autenticación y autorización.
-Orquestación mediante Docker

ARQUITECTURA

Arquitectura basada en principios:

-Arquitectura limpia
-Separación por capas (Controlador → Servicio → Repositorio)
-Modularización por dominios.
-Configuración desacoplada por variables de entorno.

backend/
│── src/
│ ├── controladores/
│ ├── servicios/
│ ├── repositorios/
│ ├── modelos/
│ ├── rutas/
│ ├── middlewares/
│ └── config/
│
│── docker-compose.yml
│── .env
│── requirements.txt / paquete.json
│── README.md

TECNOLOGÍAS.

-Python / Node.js (segun la implementacion)
-FastAPI / Express
-Pandas / Numpy
-PostgreSQL / MySQL
-Docker
-JWT (Authentication)
-SQLAlchemy

VARIABLES DE ENTORNO

Definir archivo .envbasado en .env.example:

APP_PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_USER=datamark
DB_PASSWORD=******
DB_NAME=datamark_db
JWT_SECRET=supersecretkey

PROCESAMIENTO ESTADISTICO

El sitema calcula  automaticamente:
*Media
*Mediana
*Moda
*Desviacion estandar
*Varianza
*Distribucion por categorias
*Segmentacion avanzada

Utiliza Pandas para manipulación y SQL optimizado para consultas agregadas.

ESCALABILIDAD

-Containerizacion con Docker.
-Preparado para despliegue en AWS / GCP / Azure.
-Escalable horizontalmente.
-Preparado para integracion con microservicios

SEGURIDAD

-Autenticacion JWT.
-Haash de contraseñas con bcrypt
-Validacion de entrada
-Proteccion de CORS
-Control de roles


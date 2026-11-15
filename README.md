# StockFlow - Supermercado Online (Backend REST API + PostgreSQL)

**StockFlow** es una plataforma web de comercio electrónico y gestión de inventario para supermercados y distribuidoras. Permite a clientes minoristas, tenderos y compradores mayoristas consultar disponibilidad en tiempo real, filtrar productos por categoría y realizar **pedidos anticipados** con descuento automático de stock en bodega.

---

## Arquitectura del Proyecto

El backend está desarrollado en **Node.js**, **Express** y **TypeScript**, estructurado bajo una **Arquitectura en Capas** combinada con el **Patrón Repository** conectado a una base de datos relacional **PostgreSQL** ejecutándose en **Docker**.

```text
Supermarket/
├── database/
│   ├── Dockerfile                         # Imagen personalizada de PostgreSQL 16
│   └── init.sql                           # Esquema relacional (usuarios, productos, pedidos) y datos base
├── postman/
│   └── stockflow.postman_collection.json  # Colección de pruebas automatizadas (Postman / Newman)
├── public/                                # Frontend estático servido por Express
│   ├── css/                               # Hojas de estilo
│   ├── img/                               # Imágenes del catálogo
│   ├── index.html                         # Vista principal (Catálogo y carrito)
│   ├── login.html                         # Vista de inicio de sesión
│   └── register.html                      # Vista de registro de usuarios
├── src/                                   # Código fuente Backend en TypeScript
│   ├── config/
│   │   └── database.ts                    # Pool de conexiones con node-postgres (pg)
│   ├── controllers/                       # Capa HTTP (Manejo de Request y Response)
│   ├── models/                            # Entidades, Interfaces, DTOs y AppError
│   ├── repositories/                      # Capa de acceso a datos SQL (PostgreSQL)
│   ├── routes/                            # Definición de rutas REST (/api/v1)
│   ├── services/                          # Lógica de negocio y validaciones
│   └── server.ts                          # Punto de entrada del servidor Express
├── package.json                           # Dependencias y scripts de ejecución
└── tsconfig.json                          # Configuración del compilador TypeScript

# 1. Construir la imagen personalizada con las tablas y datos iniciales
docker build -t stockflow-db ./database

# 2. Iniciar el contenedor en segundo plano en el puerto 5432
docker run -d \
  --name stockflow-postgres \
  -p 5432:5432 \
  -v stockflow_pgdata:/var/lib/postgresql/data \
  stockflow-db

## Instalar Dependencias y arrancar el servidor

# 1. Instalar dependencias de Node.js
npm install

# 2. Iniciar el servidor en modo desarrollo
npm run dev

si todo esta bien veras:
Conectado exitosamente a PostgreSQL (Docker)
Servidor corriendo en: http://localhost:3000
API REST disponible en: http://localhost:3000/api/v1/products

---

### Siguiente Paso

¡Tu proyecto **StockFlow** está listo para subir a GitHub! Solo recuerda asegurarte de que tu archivo `.gitignore` incluya `node_modules/` y `dist/` para mantener el repositorio limpio. ¿Necesitas ayuda con algún comando de Git para subirlo o algún otro ajuste en el código?

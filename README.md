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
```

## Requisitos previos en tu sistema operativo
Antes de iniciar el proyecto, asegúrate de tener el motor de **Docker** activo en tu equipo:
* **En Linux (Arch / Ubuntu / Debian):**
  ```bash
  sudo systemctl enable --now docker

Para **Windows** es suficiente con abrir la aplicacion **Docker Desktop** y esperar a que el estado sea "Docker Desktop is running".
De forma alternativa se puede ejecutar en **PowerShell:**
    ```PowerShell
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

## Instalar Dependencias y arrancar el servidor

# 1. Instalar dependencias de Node.js

    npm install

# 2. Iniciar el servidor en modo desarrollo

    npm run dev:all

si todo esta bien veras:
Conectado exitosamente a PostgreSQL (Docker)
Servidor corriendo en: http://localhost:3000
API REST disponible en: http://localhost:3000/api/v1/products

npm run dev:all ejecuta de manera automatica el servidor de PostgreSQL una vez ejecutado ese comando, no es necesario ejecutarlo de nuevo a menos que se reinicie/apague el dispositivo en el que se esta trabajando. Si desea ejecutarl el servidor nuevamente es suficiente con ejecutar:

    npm run dev




-- Tabla USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50) NOT NULL DEFAULT 'Abarrotes',
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen VARCHAR(255) DEFAULT 'img/default-product.jpg'
);

-- Tabla PEDIDOS (relacion entre usarios y productos)
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
    producto_id INT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'CONFIRMADO',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DATOS INICIALES
INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen) VALUES
('Galletas Spider-Man Halloween x4', 'Paquete especial edición Halloween x4 unidades', 'Combos', 15000, 20, 'img/galletas-spiderman.jpg'),
('Arroz Roa x 500g', 'Arroz blanco fortificado bolsa de 500 gramos', 'Abarrotes', 2400, 150, 'img/arroz-roa.jpg'),
('Aceite Premier 1L', 'Aceite vegetal de girasol botella 1 litro', 'Abarrotes', 9800, 85, 'img/aceite-premier.jpg'),
('Leche Alquería x 1L', 'Leche entera larga vida bolsa 1 litro', 'Lácteos', 4100, 300, 'img/leche-alqueria.jpg'),
('Café Sello Rojo 500g', 'Café tostado y molido tradicional 500 gramos', 'Abarrotes', 14500, 12, 'img/cafe-sello-rojo.jpg'),
('Gaseosa Coca-Cola 1.5L', 'Bebida gaseosa sabor original botella 1.5 litros', 'Bebidas', 5200, 90, 'img/coca-cola.jpg');

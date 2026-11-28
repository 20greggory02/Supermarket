const API_BASE_URL = '/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. INICIO DE SESIÓN (login.html)
    // ==========================================
    const loginForm = document.getElementById('loginForm');
    const mensajeError = document.getElementById('mensajeError');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (mensajeError) mensajeError.textContent = '';

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Correo o contraseña incorrectos');
                }

                localStorage.setItem('usuario', JSON.stringify(data.user || data.usuario || data));
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }

                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error en login:', error);
                if (mensajeError) {
                    mensajeError.textContent = error.message;
                } else {
                    alert(error.message);
                }
            }
        });
    }

    // ==========================================
    // 2. REGISTRO DE USUARIO (register.html)
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    const mensajeEstado = document.getElementById('mensajeEstado');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (mensajeEstado) {
                mensajeEstado.textContent = '';
                mensajeEstado.style.color = '#d9534f';
            }

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const address = document.getElementById('address').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                if (mensajeEstado) mensajeEstado.textContent = 'Las contraseñas no coinciden.';
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        confirmPassword,
                        phone,
                        address
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.message || 'No se pudo completar el registro');
                }

                if (mensajeEstado) {
                    mensajeEstado.style.color = '#28a745';
                    mensajeEstado.textContent = '¡Registro exitoso! Redirigiendo...';
                }

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1200);
            } catch (error) {
                console.error('Error en registro:', error);
                if (mensajeEstado) {
                    mensajeEstado.textContent = error.message;
                } else {
                    alert(error.message);
                }
            }
        });
    }
});

    // ==========================================================
// 4. TIENDA (index.html): catálogo, carrito y pedido
//    Todo viene del backend: GET /products y POST /orders
// ==========================================================
let products = [];
let cart = [];
let activeCategory = 'Todos';
let lastAddedId = null;
let sendingOrder = false;
let toastTimer = null;

const FALLBACK_IMG_BY_NAME = {
    'arroz roa x 500g': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    'aceite premier 1l': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300',
    'leche alquería x 1l': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300',
    'café sello rojo 500g': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300',
    'gaseosa coca-cola 1.5l': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300',
    'queso colanta x 500g': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300',
    'combo tienda básica': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300'
};
const PLACEHOLDER_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#f3e0e0"/>' +
    '<text x="150" y="112" font-size="48" text-anchor="middle">📦</text></svg>'
);

function esc(texto) {
    return String(texto).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

function money(valor) {
    return '$ ' + Number(valor).toLocaleString('es-CO');
}

function getUsuario() {
    try {
        const raw = localStorage.getItem('usuario');
        const usuario = raw ? JSON.parse(raw) : null;
        return usuario && usuario.id ? usuario : null;
    } catch (error) {
        return null;
    }
}

// ---------- Catálogo ----------
async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    if (!products.length) {
        grid.innerHTML = '<p class="grid-msg">Cargando productos…</p>';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || data.message || 'No se pudieron cargar los productos');
        }
        products = data.products || [];
        syncCartWithProducts();
        applyFilters();
        updateCart();
    } catch (error) {
        console.error('Error cargando productos:', error);
        const mensaje = error instanceof TypeError
            ? 'No se pudo conectar con el servidor. ¿Está encendido?'
            : error.message;
        grid.innerHTML = `<p class="grid-msg error">${esc(mensaje)}</p>`;
    }
}

function syncCartWithProducts() {
    cart = cart.filter(item => products.some(p => p.id === item.id));
    cart.forEach(item => {
        const real = products.find(p => p.id === item.id);
        item.name = real.name;
        item.price = real.price;
        item.img = real.img;
        if (item.qty > real.stock) item.qty = real.stock;
    });
    cart = cart.filter(item => item.qty > 0);
}

function imageFor(product) {
    return product.img || FALLBACK_IMG_BY_NAME[product.name.toLowerCase()] || PLACEHOLDER_IMG;
}

function attachImageFallbacks(contenedor) {
    contenedor.querySelectorAll('img[data-name]').forEach(img => {
        img.addEventListener('error', () => {
            const respaldo = FALLBACK_IMG_BY_NAME[img.dataset.name.toLowerCase()];
            if (respaldo && img.src !== respaldo && !img.dataset.triedFallback) {
                img.dataset.triedFallback = '1';
                img.src = respaldo;
            } else {
                img.onerror = null;
                img.src = PLACEHOLDER_IMG;
            }
        });
    });
}

function renderProducts(itemsToRender = products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (itemsToRender.length === 0) {
        grid.innerHTML = '<p class="grid-msg">No se encontraron productos.</p>';
        return;
    }

    itemsToRender.forEach(product => {
        const isLow = product.stock < 15;
        const agotado = product.stock <= 0;
        const card = document.createElement('div');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <div class="in-cart-chip" data-chip="${product.id}" hidden></div>
            <img src="${esc(imageFor(product))}" alt="${esc(product.name)}" class="product-img" data-name="${esc(product.name)}">
            <div class="product-title">${esc(product.name)}</div>
            <div class="product-price">${money(product.price)} / ud</div>
            <div class="product-stock ${isLow ? 'low' : ''}">
                ${agotado ? '✗ Agotado' : (isLow ? '⚠️ Últimas unidades:' : '✓ Stock en bodega:') + ' ' + product.stock + ' uds'}
            </div>
            <button class="btn-add" onclick="addToCart(${product.id}, this)" ${agotado ? 'disabled' : ''}>
                <svg class="cart-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1.003 1.003 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg>
                <span>${agotado ? 'Agotado' : 'Agregar al Pedido'}</span>
            </button>
        `;
        grid.appendChild(card);
    });

    attachImageFallbacks(grid);
    refreshCardChips();
}

function refreshCardChips() {
    document.querySelectorAll('.product-card').forEach(card => {
        const id = Number(card.dataset.id);
        const enCarrito = cart.find(item => item.id === id);
        const chip = card.querySelector('.in-cart-chip');
        card.classList.toggle('in-cart', !!enCarrito);
        if (enCarrito) {
            chip.textContent = `🛒 ${enCarrito.qty} en tu pedido`;
            chip.hidden = false;
        } else {
            chip.hidden = true;
        }
    });
}

function applyFilters() {
    const input = document.getElementById('searchInput');
    const term = input ? input.value.toLowerCase().trim() : '';
    const filtered = products.filter(p =>
        (activeCategory === 'Todos' || p.category === activeCategory) &&
        p.name.toLowerCase().includes(term)
    );
    renderProducts(filtered);
}

function filterCategory(category, btnElement) {
    activeCategory = category;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
    applyFilters();
}

function filterProducts() {
    applyFilters();
}

// ---------- Carrito ----------
function addToCart(productId, btn) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) {
        showToast('Producto agotado en bodega.', true);
        return;
    }

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        if (cartItem.qty >= product.stock) {
            showToast('Alcanzaste el límite de stock disponible en bodega.', true);
            return;
        }
        cartItem.qty++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
    }

    lastAddedId = productId;
    updateCart();
    bumpCartIcon();
    showToast(`✓ ${product.name} agregado al pedido`);
    if (btn) flashAdded(btn);
}

function changeQty(productId, delta) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    if (!cartItem || !product) return;

    cartItem.qty += delta;
    if (cartItem.qty > product.stock) {
        cartItem.qty = product.stock;
        showToast('No hay más unidades en stock.', true);
    }
    if (cartItem.qty <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    updateCart();
}

function updateCart() {
    const cartList = document.getElementById('cartList');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');
    const orderBtn = document.querySelector('.btn-order');

    cartList.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            totalItems += item.qty;

            const row = document.createElement('div');
            row.className = 'cart-item' + (item.id === lastAddedId ? ' just-added' : '');
            row.innerHTML = `
                <img class="cart-thumb" src="${esc(imageFor(item))}" alt="" data-name="${esc(item.name)}">
                <div class="cart-item-info">
                    <strong>${esc(item.name)}</strong><br>
                    <small>${money(item.price)} x ${item.qty} = <b>${money(subtotal)}</b></small>
                </div>
                <div class="cart-item-controls">
                    <button class="btn-qty" onclick="changeQty(${item.id}, -1)" aria-label="Quitar una unidad">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty" onclick="changeQty(${item.id}, 1)" aria-label="Agregar una unidad">+</button>
                </div>
            `;
            cartList.appendChild(row);
        });
        attachImageFallbacks(cartList);
    }
    lastAddedId = null;

    cartTotal.innerText = money(total);
    cartCount.innerText = totalItems;
    cartCount.classList.toggle('empty', totalItems === 0);
    if (orderBtn) orderBtn.disabled = cart.length === 0 || sendingOrder;
    refreshCardChips();
}

function bumpCartIcon() {
    const icon = document.getElementById('cartIcon');
    icon.classList.remove('bump');
    void icon.offsetWidth;
    icon.classList.add('bump');
}

function flashAdded(btn) {
    const label = btn.querySelector('span');
    btn.classList.add('added');
    label.textContent = '✓ Agregado';
    setTimeout(() => {
        btn.classList.remove('added');
        label.textContent = 'Agregar al Pedido';
    }, 900);
}

function showToast(mensaje, esError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.setAttribute('role', 'status');
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.classList.toggle('error', esError);
    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 1800);
}

function addPromoCombo() {
    const combo = products.find(p => p.name.toLowerCase().includes('combo tienda'));
    if (!combo) {
        showToast('El combo no está disponible por ahora.', true);
        return;
    }
    addToCart(combo.id);
}

// ---------- Pedido (se guarda en el backend) ----------
function showModal(titulo, mensaje, { resumen = [], total = null, esError = false } = {}) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalTitle').classList.toggle('error', esError);
    document.getElementById('modalMessage').textContent = mensaje;

    const lista = document.getElementById('modalSummary');
    lista.innerHTML = resumen
        .map(r => `<li><span>${esc(r.name)} x ${r.qty}</span><span>${money(r.price * r.qty)}</span></li>`)
        .join('');

    const totalEl = document.getElementById('modalTotal');
    totalEl.textContent = total !== null ? `Total: ${money(total)}` : '';

    document.getElementById('orderModal').style.display = 'flex';
}

async function confirmOrder() {
    if (sendingOrder) return;
    if (cart.length === 0) {
        showModal('Tu carrito está vacío', 'Selecciona productos primero.', { esError: true });
        return;
    }

        const usuario = getUsuario();
    if (!usuario) {
        showModal(
            'Inicia sesión para pedir',
            'Para confirmar un pedido necesitas una cuenta. Inicia sesión o regístrate y vuelve a armar tu pedido.',
            { esError: true }
        );
        return;
    }

    const body = {
        userId: usuario.id,
        items: cart.map(item => ({ productId: item.id, quantity: item.qty }))
    };

    const orderBtn = document.querySelector('.btn-order');
    const textoOriginal = orderBtn.textContent;
    sendingOrder = true;
    orderBtn.disabled = true;
    orderBtn.textContent = 'Enviando pedido…';

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'No se pudo registrar el pedido');
        }

        const resumen = cart.map(item => ({ name: item.name, qty: item.qty, price: item.price }));
        const total = data.order && data.order.total !== undefined ? data.order.total : null;

        cart = [];
        await loadProducts();
        updateCart();
        showModal('¡Pedido Confirmado! 🎉', data.message || 'Tu pedido fue registrado.', { resumen, total });
    } catch (error) {
        console.error('Error al confirmar el pedido:', error);
        const mensaje = error instanceof TypeError
            ? 'No se pudo conectar con el servidor. Tu carrito sigue guardado, intenta de nuevo.'
            : error.message;
        showModal('No se pudo confirmar el pedido', mensaje, { esError: true });
        loadProducts();
    } finally {
        sendingOrder = false;
        orderBtn.textContent = textoOriginal;
        updateCart();
    }
}

function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

function scrollToCart() {
    document.getElementById('cartSection').scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('productsGrid')) return; // solo en index.html

    const buscador = document.getElementById('searchInput');
    if (buscador) buscador.addEventListener('keyup', filterProducts);

    updateCart();
    loadProducts();
});
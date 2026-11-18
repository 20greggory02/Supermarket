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
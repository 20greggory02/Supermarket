// Muestra el nombre del usuario en el header de index.html si hay sesión iniciada.
// El login (app.js) guarda al usuario en localStorage con la clave "usuario".
(function () {
    function obtenerUsuario() {
        try {
            const raw = localStorage.getItem('usuario');
            const usuario = raw ? JSON.parse(raw) : null;
            return usuario && usuario.name ? usuario : null;
        } catch (error) {
            return null; // JSON dañado o localStorage no disponible
        }
    }

    function cerrarSesion() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        window.location.reload();
    }

    document.addEventListener('DOMContentLoaded', () => {
        const authLinks = document.getElementById('authLinks');
        const userBox = document.getElementById('userBox');
        const userName = document.getElementById('userName');
        const logoutBtn = document.getElementById('logoutBtn');

        if (!authLinks || !userBox || !userName) return;

        const usuario = obtenerUsuario();
        if (!usuario) return; // visitante: se quedan los botones originales

        userName.textContent = usuario.name; // textContent evita inyectar HTML
        authLinks.classList.add('oculto');
        userBox.classList.remove('oculto');

        if (logoutBtn) logoutBtn.addEventListener('click', cerrarSesion);
    });
})();
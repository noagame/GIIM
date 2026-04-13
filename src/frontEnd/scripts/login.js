// Esperamos a que todo el HTML cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // Seleccionamos el formulario usando su ID
    const loginForm = document.getElementById('login-form');

    // Escuchamos el evento "submit" (cuando se presiona el botón o se da Enter)
    loginForm.addEventListener('submit', async (e) => {

        // ¡Muy importante! Evita que la página se recargue al enviar el formulario
        e.preventDefault();

        // 1. Obtenemos los valores que el usuario escribió
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            // 2. Hacemos la petición a nuestra API (El puente entre Front y Back)
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST', // Usamos POST porque enviamos datos sensibles
                headers: {
                    'Content-Type': 'application/json' // Le decimos al servidor que enviamos JSON
                },
                body: JSON.stringify({ email, pass: password })
            });

            // 3. Esperamos la respuesta del servidor y la leemos
            const data = await response.json();

            // 4. Evaluamos si el servidor respondió con éxito (Status 200)
            if (response.ok) {
                // ¡Login exitoso!
                alert(`¡Bienvenido, ${data.user.name_user}!`);

                // Más adelante, aquí cambiaremos la ventana al inventario real:
                // window.location.href = 'dashboard.html'; 
            } else {
                // Si hay error (ej. inactivo o contraseña mal), lo mostramos en pantalla
                alert(`Atención: ${data.error}`);
            }

        } catch (error) {
            // Si el servidor de Node está apagado, saltará este error
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor. ¿Está encendido?');
        }
    });
});
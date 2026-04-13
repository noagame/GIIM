document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitamos que la página se recargue

        // Capturamos los datos de los inputs
        const name_user = document.getElementById('name').value;
        const last_name = document.getElementById('lastname').value;
        const email = document.getElementById('email').value;
        const rol = document.getElementById('role').value;
        const pass = document.getElementById('password').value;

        try {
            // Hacemos la solicitud POST a la API
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name_user, last_name, email, rol, pass })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Muestra "Usuario registrado. Pendiente de aprobación."
                // Redirigimos al login para que espere su aprobación
                window.location.href = 'login.html'; 
            } else {
                alert(`Error: ${data.error}`);
            }

        } catch (error) {
            console.error('Error de conexión:', error);
            alert('No se pudo conectar con el servidor.');
        }
    });
});
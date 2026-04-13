const express = require('express');
const router = express.Router();
const userService = require('../services/user.service'); // Importamos el servicio
const { validarRegistro } = require('../middlewares/auth.middleware'); // Importamos el middleware de validación

// Ruta de registro de usuario
router.post('/register', validarRegistro, async (req, res) => {
    console.log("📥 Nueva solicitud de registro recibida:", req.body); // <-- Agrega esta línea
    try {
        // Usamos el servicio para crear el usuario
        const nuevoUsuario = await userService.crearUsuario(req.body); 

        res.status(201).json({ message: "Usuario registrado. Pendiente a aprobación.", usuario: nuevoUsuario });
    } catch (e) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta de login de usuario
router.post('/login', async (req, res) => {
    const { email, pass } = req.body;
    
    if (!email || !pass) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }
    
    try {
        const user = await userService.loginUsuario(email, pass);
        res.status(200).json({ message: 'Login exitoso', user });
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
}); 

// Ruta de Consulta de ususarios
router.get('/users', async (req, res) => {
    try {
        // Usamos el servicio para obtener los usuarios
        const usuarios = await userService.obtenerUsuarios(); 
        res.status(200).json(usuarios);
    } catch (e) {
        console.error('Error al obtener usuarios:', e);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});


router.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const camposRecibidos = req.body;

    // Whitelist de campos permitidos para actualización
    const camposPermitidos = ['name_user', 'last_name', 'email', 'is_active', 'pass'];

    // Filtramos solo los campos permitidos
    const camposFiltrados = {};
    Object.keys(camposRecibidos).forEach(key => {
        if (camposPermitidos.includes(key)) {
            camposFiltrados[key] = camposRecibidos[key];
        }
    });
        
    if (Object.keys(camposFiltrados).length === 0) {
        return res.status(400).json({ error: 'No hay campos validos para actualizar ' });
    }

    try {
        const usuarioActualizado = await userService.actualizacionParametros(id, camposFiltrados);

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioActualizado);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Ruta de eliminación de usuario
router.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const eliminado = await userService.eliminarUsuario();
        if (!eliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (e) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    const { name_user, last_name, email, is_active, rol } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Users (name_user, last_name, email, is_active, rol) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name_user, last_name, email, is_active, rol]
        );
        res.status(201).json(result.rows[0]);
    } catch (e) {
        console.error('Error al registrar usuario:', e);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// Ruta de Consulta de ususarios
router.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Users');
        res.status(200).json(result.rows);
    } catch (e) {
        console.error('Error al obtener usuarios:', e);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

/* Ruta de Actualizaciones  
    - Acutializar nombre
    - Actualizar apellido
    - Actualizar email
    - Actualizar estado de actividad
    - Actualizar rol
*/
app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name_user, last_name, email, is_active, rol } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Users SET name_user = $1, last_name = $2, email = $3, is_active = $4, rol = $5 WHERE id_users = $6 RETURNING *',
            [name_user, last_name, email, is_active, rol, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);
    } catch (e) {
        console.error('Error al actualizar usuario:', e);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Ruta de eliminación de usuario
app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Users WHERE id_users = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (e) {
        console.error('Error al eliminar usuario:', e);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
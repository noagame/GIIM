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
    - Acutilizar nombre
    - Actualizar apellido
    - Actualizar email
    - Actualizar estado de actividad
    - Actualizar rol
*/
router.patch('/users/:id', async (req, res) => {
    const { id } = req.params;
    const campos = req.body;

    // Validación de que el cuerpo no esté vacío
    const llaves = Object.keys.values(campos);
    if (llaves.length === 0) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud no puede estar vacío' });
    }

    try {
        // Construcción dinámica de la parte SET de la consulta SQL
        const setSql = llaves
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

        // Valores correspondientes a los campos a actualizar
        const valores = Object.values(campos);

        // Construcción de la consulta SQL dinámica
        const query = `UPDATE Users SET ${setSql} WHERE id_users = $${llaves.length + 1} RETURNING *`;
        
        // Ejecución de arreglo + ID usuario
        const result = await pool.query( query, [...valores, id]);

        // Verificación de que el usuario exista
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(result.rows[0]);

    } catch (e) {
        // Manejo de errores
        console.error('Error al actualizar usuario:', e);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// Ruta de eliminación de usuario
router.delete('/users/:id', async (req, res) => {
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
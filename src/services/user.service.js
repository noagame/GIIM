const bycrpt = require('bcrypt');
const pool = require('../config/db');

const crearUsuario = async (userData) => {
    const { name_user, last_name, email, pass, is_active, rol } = userData;
    const saltRounds = 10;

    const hashedPassword = await bycrpt.hash(pass, saltRounds);
    const result = await pool.query(
        'INSERT INTO Users (name_user, last_name, email, pass, is_active, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name_user, last_name, email, hashedPassword, is_active, rol]
    );
    return result.rows[0];
};

// Query para obtener usuarios sin incluir la contraseña
const obtenerUsuarios = async () => {
    const query = 'SELECT id_user, name_user, last_name, email, is_active, rol FROM Users';
    const result = await pool.query(query);
    return result.rows;
}

/* Actualización dinamica de parámetros del usuario
    - Acutilizar nombre
    - Actualizar apellido
    - Actualizar email
    - Actualizar estado de actividad
    - Actualizar rol
*/
const actualizacionParametros = async (id, campos) => {
    const llaves = Object.keys(campos);
    const valores = Object.values(campos);

    const setSql = llaves
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');

    const query = `UPDATE Users SET ${setSql} WHERE id_users = $${llaves.length + 1} RETURNING *`;
    const result = await pool.query(query, [...valores, id]);
    return result.rows[0];
}

const eliminarUsuario = async () => {
    const query = 'DELETE FROM Users WHERE id_users = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = { crearUsuario, obtenerUsuarios, eliminarUsuario, actualizacionParametros };
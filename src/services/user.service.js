const bcrypt = require('bcrypt');
const pool = require('../config/db');

const crearUsuario = async (userData) => {
    const { name_user, last_name, email, pass, rol } = userData;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(pass, saltRounds);

    const is_active = false; // Por defecto, el usuario se crea como inactivo

    const result = await pool.query(
        'INSERT INTO Users (name_user, last_name, email, pass, is_active, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [name_user, last_name, email, hashedPassword, is_active, rol]
    );
    return result.rows[0];
};

const loginUsuario = async (email, pass) => {
    const query = 'SELECT * FROM Users WHERE email = $1';
    const result = await pool.query(query, [email]);

    const user = result.rows[0];

    // Si el usuario no existe, lanzamos un error
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    // Verificamos si el admin ya lo aprobo 
    if (!user.is_active) {
        throw new Error('Usuario no aprobado por el administrador');
    }
    // Comparamos la contraseña ingresada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(pass, user.pass); // 
    if (!isMatch) {
        throw new Error('Contraseña incorrecta');
    }

    return user;
};

// Query para obtener usuarios sin incluir la contraseña
const obtenerUsuarios = async () => {
    const query = 'SELECT id_users, name_user, last_name, email, is_active, rol FROM Users';
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

const eliminarUsuario = async (id) => {
    const query = 'DELETE FROM Users WHERE id_users = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
}

module.exports = {
    crearUsuario,
    obtenerUsuarios,
    eliminarUsuario,
    actualizacionParametros,
    loginUsuario
};
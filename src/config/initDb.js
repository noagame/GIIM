const pool = require('./db');

const initDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NO EXISTS Users (
                id_users SERIAL PRIMARY KEY,
                name_user VARCHAR(25) NOT NULL,
                last_name VARCHAR(25) NOT NULL,
                email VARCHAR(50) NOT NULL UNIQUE,
                is_active BOOLEAN DEFAULT false,
                rol VARCHAR(10) NOT NULL
            );
        `);
        console.log('Tabela "usuarios" creada o existe.');
    } catch (err) {
        console.error('Error al crear la tabla usuarios":', err);
    }
};

module.exports = initDb;
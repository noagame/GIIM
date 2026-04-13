const validarRegistro = (req, res, next) => {
    const { email, pass, name_user, rol } = req.body;

    // 1. Validación de campos vacíos
    if (!email || !pass || !name_user || !rol) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (pass.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // 2. Validación estricta de Roles (¡Seguridad!)
    const rolesPermitidos = ['medico', 'farmaceutico'];
    if (!rolesPermitidos.includes(rol)) {
        return res.status(403).json({ error: "Rol no permitido. Contacte a un administrador." });
    }

    next(); // Todo está perfecto, pasa al controlador
};

module.exports = { validarRegistro };
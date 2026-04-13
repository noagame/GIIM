const validarRegistro = (req, res, next) => {
    const { email, pass, name_user } = req.body;

    // Validación simple
    if (!email || !pass || !name_user) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (pass.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    next(); // Si todo está bien, pasamos al siguiente paso
};

module.exports = { validarRegistro };
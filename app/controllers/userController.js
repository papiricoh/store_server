// Importar modelo de usuario
const User = require('../models/db');

// Controlador para obtener información de un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario por ID' });
  }
};

// Controlador para crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create(name, email, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};
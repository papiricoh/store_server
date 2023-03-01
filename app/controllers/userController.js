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

exports.logIn = async (req, res) => {
  var error_type = 0;
  try {
    const { name, password } = req.body;
    const user = await User.findByName(name);
    console.log(user);
    if(user.pass != password) {
      error_type = 1;
      throw new Error('Password not mach'); 
    }
    res.status(200).json(user.identifier); //Returns identifier
  } catch (err) {
    if(error_type == 1) {
      res.status(500).json({ message: 'Password not mach' });
    }else {
      res.status(500).json({ message: 'Error al buscar usuario' });
    }
  }
};
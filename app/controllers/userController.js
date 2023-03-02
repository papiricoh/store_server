// Importar modelo de usuario
const User = require('../models/db');
const bcrypt = require('bcrypt');

async function generateIdentifier(name, email) {
  const plaintextIdentifier = name + email;
  return new Promise((resolve, reject) => {
    bcrypt.hash(plaintextIdentifier, 10, function(err, hash) {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  });
}

// Controlador para obtener información de un usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Controlador para crear un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (name == await User.findByName(name).name || email == await User.findByEmail(email).email) {
      throw new Error('User Exists'); 
    } else {
      const identifier = await generateIdentifier(name, email).then((hash) => { return hash }).catch((err) => {throw new Error('Failed Cryptography'); });
      
      const user = await User.register( identifier, name, email, password);
      if(user instanceof Error) {
        throw new Error(user.message)
      }
      res.status(201).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.logIn = async (req, res) => {
  var error_type = 0;
  try {
    const { name, password } = req.body;
    const user = await User.findByName(name);
    if(user.pass != password) {
      error_type = 1;
      throw new Error('Password not mach'); 
    }
    res.status(200).json({ identifier: user.identifier}); //Returns identifier
  } catch (err) {
    if(error_type == 1) {
      res.status(500).json({ message: 'Password not mach' });
    }else {
      res.status(500).json({ message: 'Error al buscar usuario' });
    }
  }
};
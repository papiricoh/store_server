// Importar modelo de usuario
const User = require('../models/db');
const bcrypt = require('bcrypt');
const { getProductById } = require('../models/db');
const saltRounds = 10;

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

async function comparePasswords(plaintext, ecrypted) {
  try {
    const match = await bcrypt.compare(plaintext, ecrypted);
    return match;
  } catch (err) {
    throw new Error('Error while hashing password');
  }
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
      
      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.register( identifier, name, email, encryptedPassword);
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
    if(!await comparePasswords(password, user.pass)) {
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


exports.getAllProducts = async (req, res) => {
  try {
    const products = await User.getAllProducts();
    res.status(200).json(products); //Returns identifier
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await User.getProductsByCategory(category);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsBySearch = async (req, res) => {
  try {
    const { search } = req.params;
    const products = await User.getProductsBySearch(search);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { identifier, productId, cuantity } = req.body;
    await User.checkIdentifier(identifier); //Check Identifier
    
    //Check disponible cuantity
    const productCuantity = getProductById(productId).cuantity;
    if (productCuantity - cuantity < 0) {
      res.status(500).json({ message: "Not enough cuantity of product: " + productId });
    }
    
    const result = await User.addToCart(identifier, productId, cuantity);
    res.status(201).json({ message: "Success", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
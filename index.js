const express = require('express')
const router = express.Router();
const userController = require('./app/controllers/userController');
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener información de un usuario por ID
router.get('/users/:id', userController.getUserById);

// Ruta para crear un nuevo usuario
router.post('/users', userController.createUser);

module.exports = router;
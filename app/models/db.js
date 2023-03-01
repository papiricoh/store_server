const mysql = require("mysql2");
const dbConfig = require("./config/dbConfig.js");

// Create a connection to the database
const connection = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

// open the MySQL connection
connection.connect(error => {
    if (error) throw error;
    console.log("Successfully connected to the database.");
});

const User = {
    async findById(id) {
        const [rows, fields] = await connection.query(
        `SELECT * FROM users WHERE id = ?`, 
        [id]
        );
        if (rows.length) {
            return rows[0];
        }
        throw new Error('No se encontró ningún usuario con el ID especificado');
    },

    async create(name, email, password) {
        const [result] = await connection.query(
        `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
        [name, email, password]
        );
        return { id: result.insertId, name, email };
    }
};
  
  module.exports = User;
const mysql = require("mysql2");
const dbConfig = require("../config/dbConfig.js");

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
    async findByName(name) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE name = ?`, 
        [name]
        );
        if (rows.length) {
            return rows[0];
        }
        return new Error('User with name: ' + name + ' -> Not found');
    },

    async findById(id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE id = ?`, 
        [id]
        );
        if (rows.length) {
            return rows[0];
        }
        return new Error('User with id: ' + id + ' -> Not found');
    },

    async findByEmail(email) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE email = ?`, 
        [email]
        );
        if (rows.length) {
            return rows[0];
        }
        return new Error('User with name: ' + email + ' -> Not found');
    },

    async register(identifier, name, email, password) {
        try {
            const [result] = await connection.promise().query(
            `INSERT INTO users (identifier, name, email, pass) VALUES (?, ?, ?, ?)`,
            [identifier, name, email, password]
            );
            return { identifier, name, email };
        } catch (error) {
            return new Error('User with email: ' + email + ' or User with name: ' + name + ' -> Already Exists');
        }
    },

    async getAllProducts() {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM products`);
        if (rows.length) {
            return rows;
        }
        return new Error('Products: -> Not found');
    },

    async getProductsByCategory(category) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM products WHERE id_category = (SELECT id FROM categories WHERE name = ?)`, 
        [category]
        );
        if (rows.length) {
            return rows;
        }
        return new Error('Category with name: ' + category + ' -> Not found');
    },

};
  
  module.exports = User;
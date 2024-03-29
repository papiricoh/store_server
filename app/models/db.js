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

    async checkIdentifier(identifier) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM users WHERE identifier = ?`, 
        [identifier]
        );
        if (rows.length) {
            return rows[0];
        }
        return new Error('User with identifier: ' + identifier + ' -> Not exists');
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
        console.error(email + ' User not found');
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


    async getProductById(id) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM products WHERE id = ?`, 
        [id]
        );
        if (rows.length) {
            return rows[0];
        }
        return new Error('Product with id: ' + id + ' -> Not found');
    },

    async getProductsBySearch(search) {
        const [rows, fields] = await connection.promise().query(
        `SELECT * FROM products WHERE name LIKE '%` + search + `%'`
        );
        if (rows.length) {
            return rows;
        }
        return new Error('Search with name: ' + search + ' -> Not found');
    },

    async addToCart(identifier, productId, cuantity) {
        try {
            const [result] = await connection.promise().query(
            `INSERT INTO shopping_cart (id_product, id_user, cuantity) VALUES (?, (SELECT id FROM users WHERE identifier = ?), ?)`,
            [productId, identifier, cuantity]
            );
            return { identifier, productId, cuantity };
        } catch (error) {
            return new Error('User with identifier: ' + identifier + ' and product with id: ' + productId + ' -> Coudn\'be added');
        }
    },

};
  
module.exports = User;
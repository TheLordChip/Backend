import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

export default class ProductService {
    constructor() {
        // No in-memory array needed
    }

    async getAll() {
        const result = await pool.query('SELECT * FROM shop.products ORDER BY id');
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query('SELECT * FROM shop.products WHERE id=$1', [id]);
        return result.rows[0]; // undefined if not found
    }

    async save(product) {
        if (product.id) {
            // Update existing product
            await pool.query(
                'UPDATE shop.products SET name=$1, price=$2 WHERE id=$3',
                [product.name, Number(product.price), Number(product.id)]
            );
        } else {
            // Insert new product
            await pool.query(
                "INSERT INTO shop.products (id, name, price) VALUES (nextval('shop.product_seq'), $1, $2)",
                [product.name, Number(product.price)]
            );
        }
    }

    async deleteById(id) {
        await pool.query('DELETE FROM shop.products WHERE id=$1', [Number(id)]);
    }
}

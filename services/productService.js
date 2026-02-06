import ProductRepository from "../repositories/productRepository.js";

export default class ProductService {
    constructor() {
        // No in-memory array needed
        this.productRepository = new ProductRepository()
    }

    async getAll() {
        return this.productRepository.getAll()
    }

    async getById(id) {
        const result = await pool.query('SELECT * FROM shop.products WHERE id=$1', [id]);
        return result.rows[0]; // undefined if not found
    }

    async save(product) {
        return this.productRepository.save(product)
    }

    async deleteById(id) {
        await pool.query('DELETE FROM shop.products WHERE id=$1', [Number(id)]);
    }
}

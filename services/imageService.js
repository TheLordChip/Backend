import ImageRepository from "../repositories/imageRepository.js";

export default class ImageService {
    constructor() {
        // No in-memory array needed
        this.imageRepository = new ImageRepository()
    }

    async getAll() {
        return this.imageRepository.getAll()
    }

    // async getById(id) {
    //     const result = await pool.query('SELECT * FROM shop.products WHERE id=$1', [id]);
    //     return result.rows[0]; // undefined if not found
    // }

    async save(image) {
      await this.imageRepository.save(image)
    }
    async getMainImage(productId){
        return this.imageRepository.getMainImage(productId)
    }

    // async deleteById(id) {
    //     await pool.query('DELETE FROM shop.products WHERE id=$1', [Number(id)]);
    // }
}

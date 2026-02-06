import { pool } from "../middleware/db.js";
export default class ImageRepository {
    async getAll(){
        try{
            let images = await pool.query(
                'SELECT * FROM shop.images');
            return images.rows;
        }
        catch(error) {
            throw new Error("DB QUERY ERROR:" + error)
        }
    }
    async save(image){
        try{
         await pool.query("INSERT INTO shop.images(image_src, main_image, product_id) VALUES ($1, $2, $3)",[image.src, image.main, image.productId])
        }
        catch(error) {
            throw new Error("DB QUERY ERROR:" + error)
        }
    }
    async getMainImage(productId){
        try{
            let images = await pool.query(
                'SELECT * FROM shop.images WHERE main_image = TRUE AND product_id = $1', [productId]);
            return images.rows[0];
        }
        catch(error) {
            throw new Error("DB QUERY ERROR:" + error)
        }
    }
}
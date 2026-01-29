import { pool } from "../middleware/db.js";
export default class ProductRepository {
    async getAll(){
        try{
        let products = await pool.query(
            'SELECT p.id, p.name, p.price,' +
            ' c.name as category_name ' +
            'FROM shop.products p' +
            ' LEFT JOIN shop.categories c ON p.category_id=c.id order by p.id');
        return products.rows;
    }
    catch(error) {
            throw new Error("DB QUERY ERROR:" + error)
    }
}
}
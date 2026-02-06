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
    async save(product){
        try {
            if (product.id) {
                // Update existing product
                await pool.query(
                    'UPDATE shop.products SET name=$1, price=$2, category_id=$3 WHERE id=$4',
                    [product.name, Number(product.price), Number(product.category_id), Number(product.id)]
                );
            } else {
                // Insert new product
                let result = await pool.query(
                    "INSERT INTO shop.products (id, name, price, category_id) VALUES (nextval('shop.product_seq'), $1, $2, $3) RETURNING id",
                    [product.name, Number(product.price), Number(product.category_id)]
                );
                product.id = result.rows[0].id
            }
            return product;
        }
        catch(error) {
            throw new Error("DB QUERY ERROR:" + error)
        }
    }
}
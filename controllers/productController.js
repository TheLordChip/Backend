import ProductService from "../services/productService.js";
import ImageService from "../services/imageService.js";

export default class ProductController {
    constructor() {
        this.productService = new ProductService();
        this.imageService = new ImageService()
        this.getAllProducts = this.getAllProducts.bind(this);
        this.getCatalogue = this.getCatalogue.bind(this);
        this.getProductById = this.getProductById.bind(this);
        this.createProduct = this.createProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }

    async getCatalogue(req, res){
        const products = await this.productService.getAll()
        for (const p of products) {
            const mainImage= await this.imageService.getMainImage(p.id)
            if(mainImage) {
                p.file_name = "/uploads/" + mainImage.src
            }
        }
        res.render("catalogue", {products: products})
    }
    // GET /prod
    async getAllProducts(req, res) {
        try {
            const userRole = req.session.user.role;
            const products = await this.productService.getAll();
            res.render("products", { products, userRole });
        } catch (err) {
            console.error(err);
            res.status(500).send("Failed to fetch products");
        }
    }

    // GET /edit/:id
    async getProductById(req, res) {
        try {
            const id = Number(req.params.id);
            const product = await this.productService.getById(id);
            if (product) {
                res.render("editProduct", { product });
            } else {
                res.render("error", { message: "Product not found", backURL: "/prod" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Error fetching product");
        }
    }

    // POST /createProduct
    async createProduct(req, res) {
        try {
            const { name, price, category_id } = req.body;
            const product = await this.productService.save({ name, price, category_id });
            if(req.files.main_file){
                let fileNames = req.files.main_file.map(lm => lm.filename);
                if(fileNames.length){
                    const image = {
                        src: fileNames[0],
                        main: true,
                        product_id: product.id
                    }
                    await this.imageService.save(image)
                }
            }
            res.redirect("/prod");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error creating product");
        }
    }

    // POST /editProduct
    async updateProduct(req, res) {
        try {
            const { id, name, price } = req.body;
            await this.productService.save({ id, name, price });
            res.redirect("/prod");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error updating product");
        }
    }

    // POST /delete/:id
    async deleteProduct(req, res) {
        try {
            const id = Number(req.params.id);
            await this.productService.deleteById(id);
            res.redirect("/prod");
        } catch (err) {
            console.error(err);
            res.status(500).send("Error deleting product");
        }
    }
}

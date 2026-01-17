import ProductService from "./../services/productService.js"
// class ProductController{
//     constructor() {
//         this.productService = new ProductService()
//         console.log(ProductService)
//     }
//     getAllProducts(req, res) {
//         let userRole = req.session.user.role
//         console.log(this.productService)
//         let products = this.productService.getAll()
//         res.render("products", { products, userRole });
//     }
// }
// module.exports = ProductController
export default class ProductController {
    constructor() {
        this.productService = new ProductService()
        this.getAllProducts = this.getAllProducts.bind(this)
    }

    getAllProducts(req, res) {
        const userRole = req.session.user.role
        const products = this.productService.getAll()
        res.render("products", { products, userRole })
    }
}
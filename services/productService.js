class ProductService{
    constructor() {
        this.products = [{name: "food", price: 5, id: 1},{name: "drink", price: 2, id: 2},{name: "combo", price: 6, id: 3}]
        this.id = 4
    }
    getAll(){
        return this.products
    }
    save(product){
        if(product.id){
            this.products = this.products.map(p=>{if(p.id === product.id){
                return product;
            }
            else{
                return p;
            }
            })
        }
        else{
            product.id = this.id;
            this.products.push(product)
            this.id++
        }
    }
}
module.exports = ProductService
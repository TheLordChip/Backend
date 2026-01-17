export default class ProductService {
    constructor() {
        this.products = [
            { name: "food", price: 5, id: 1 },
            { name: "drink", price: 2, id: 2 },
            { name: "combo", price: 6, id: 3 }
        ];
        this.id = 4;
    }

    deleteById(id) {
        this.products = this.products.filter(p => p.id !== id);
    }

    getAll() {
        return this.products;
    }

    save(product) {
        if (product.id) {
            const existing = this.products.find(p => p.id === product.id);
            if (existing) {
                existing.name = product.name;
                existing.price = product.price;
            }
        } else {
            product.id = this.id++;
            this.products.push(product);
        }
    }
}

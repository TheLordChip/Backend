const express = require('express');
const app = express();
const session = require('express-session')
let products = [
    {name: "food", price: 5, id: 1},
    {name: "drink", price: 2, id: 2},
    {name: "combo", price: 6, id: 3}];
let id = 4;
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Shop',
    password: 'REMOVED', // your new password
    port: 5432
});

const ProductController = require("./controllers/productController")
const productController = new ProductController()
const { requireAuthUser, requireAuthAdmin } = require("./middleware/auth");
app.set("view engine", "pug")
app.set("views", "./views")
const methodOverride = require ("method-override")
app.use(methodOverride('_method'))
const port = 3000;
// const idToEdit = Number(req.body.id)
// const price = Number(req.body.price)

let users = [{id: 1, password: "123", name: "Mykola", role: "USER"},{id:2, password:"Admin", name:"Admin", role:"ADMIN"}]
app.get('/prod', requireAuthUser, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shop.products');
        console.log("DB QUERY RESULT:", result.rows);
        let userRole = req.session.user.role;
        res.render("products", { products: result.rows, userRole });
    } catch(err) {
        console.error("DB QUERY ERROR:", err);
        res.status(500).send("Failed to fetch products");
    }
});


app.get('/createProd', requireAuthAdmin, (req, res) => {
    res.render("productForm");
});
// app.get('/productsRest', (req, res) => {
//     res.json(123products);
// });
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/test', (req, res) => {
    res.send('Hello, Test!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
app.get('/hello', (req, res) => {
    let name = req.query.name
    res.send('Hello, '+name);
});
app.get('/testPug', function(req, res){
    res.render("test", {name:"Charles"})
})

/*app.get('/prod', requireAuthUser, productController.getAllProducts  function(req, res) {
    let userRole = req.session.user.role
    res.render("products", { products, userRole });
}) */

// app.get('/createProd', requireAuthAdmin, function(req, res){
//     res.render("productForm")
// })
app.post("/createProduct", requireAuthAdmin, async function(req, res){
    let productName = req.body.name;
    let productPrice = Number(req.body.price);

    try {
        await pool.query(
            "INSERT INTO shop.products (id, name, price) VALUES (nextval('shop.product_seq'), $1, $2)",
            [productName, productPrice]
        );
        res.redirect("/prod");
    } catch(err) {
        console.error(err);
        res.status(500).send("Error creating product");
    }
});
app.post("/editProduct", requireAuthAdmin, async (req, res) => {
    const { id, name, price } = req.body;
    try {
        await pool.query(
            'UPDATE shop.products SET name=$1, price=$2 WHERE id=$3',
            [name, Number(price), Number(id)]
        );
        res.redirect("/prod");
    } catch(err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});


app.get("/edit/:id", function (req, res){
    let id = Number(req.params.id);
    let productForEdit = products.filter(product => product.id === id)
    if(productForEdit.length){
        res.render("editProduct", {product:productForEdit[0]})
    }
    else{
        res.render("error", {message:"product not found", backURL:"/prod"})
    }

})
app.post("/delete/:id", requireAuthAdmin, async (req, res) => {
    const id = Number(req.params.id);
    try {
        await pool.query('DELETE FROM shop.products WHERE id=$1', [id]);
        res.redirect("/prod");
    } catch(err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});

app.get("/auth",function (req, res){
    res.render("auth")
})
app.post("/auth", function(req,res){
    let username=req.body.login
    let password=req.body.password
    let authUsers=users.filter(user=>user.name===username &&user.password===password)
    if(authUsers.length){
        req.session.user = authUsers[0]
        let redirectPass = req.session.redirectPass?req.session.redirectPass:"/prod" // Тернарний оператор
        res.redirect(redirectPass)
    }
    else{
        res.render("auth", {message: "User Invalid"})
    }
})

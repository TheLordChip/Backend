const express = require('express');
const app = express();
const session = require('express-session')
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
const ProductController = require("./controllers/productController")
const productController = new ProductController()
app.set("view engine", "pug")
app.set("views", "./views")
const methodOverride = require ("method-override")
app.use(methodOverride('_method'))
const port = 3000;
let products = [{name: "food", price: 5, id: 1},{name: "drink", price: 2, id: 2},{name: "combo", price: 6, id: 3}]
let users = [{id: 1, password: "123", name: "Mykola", role: "USER"},{id:2, password:"Admin", name:"Admin", role:"ADMIN"}]
let id = 4
function requireAuthUser(req, res, next) {
    if (req.session.user) {
        next(); // user is logged in → continue
    } else {
        req.session.redirectPass = req.originalUrl
        res.redirect('/auth'); // not logged in → send to login
    }
}
function requireAuthAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "ADMIN") {
        next(); // user is logged in → continue
    } else if (req.session.user) {
        res.render("error", {message: "You don't have permission to view this page"})

    } else {
        req.session.redirectPass = req.originalUrl
        res.redirect('/auth'); // not logged in → send to login
    }
}
app.get('/productsRest', (req, res) => {
    res.json(products);
});
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

app.get('/prod', requireAuthUser, productController.getAllProducts /* function(req, res) {
    let userRole = req.session.user.role
    res.render("products", { products, userRole });
} */ )

app.get('/createProd', requireAuthAdmin, function(req, res){
    res.render("productForm")
})
app.post("/createProduct", function(req, res){
    let productName = req.body.name
    let productPrice = req.body.price
    products.push({name:productName, price:productPrice, id:id})
    id ++
    res.render("productForm", {message: "product successfully created"})
})
app.post("/editProduct", function(req, res){
    let id = Number(req.body.id);
    let productName = req.body.name
    let productPrice = req.body.price
    products.forEach((product, index) =>{if(product.id===id){products[index] = {name:productName, price:productPrice, id:id}}})
    res.render("productForm", {message: "product successfully created"})
})
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
app.post("/delete/:id", function (req, res){
    let id = Number(req.params.id)
    products=products.filter(product => product.id !== id)
    res.redirect("/prod")
})
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

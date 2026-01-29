import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import pkg from 'pg';
import methodOverride from 'method-override';
import { hashPassword, verifyPassword } from './middleware/password.js';
import multer from 'multer';
const app = express();
app.use(express.json());
app.use(express.static("public"));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {

        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
const { Pool } = pkg;
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'test',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const pool = new Pool({
    host: 'localhost',
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
let upload_fields = upload.fields([{ name: 'main_file', maxCount: 10 }, { name: 'other_files', maxCount: 10 }])
async function setupDatabase() {
    try {
        const setupSQL = fs.readFileSync(path.join(process.cwd(), 'setup.sql'), 'utf-8');
        await pool.query(setupSQL);
        console.log('Database setup complete from setup.sql.');
    } catch (err) {
        console.error('Error setting up database:', err);
    }
}

await pool.query('SELECT current_database(), current_user');
await setupDatabase();
import ProductController from "./controllers/productController.js";
import { requireAuthUser, requireAuthAdmin } from "./middleware/auth.js";

const productController = new ProductController();

app.set("view engine", "pug");
app.set("views", "./views");

app.get('/', (req, res) => res.send('Hello, World!'));
app.get('/test', (req, res) => res.send('Hello, Test!'));
app.get('/hello', (req, res) => res.send('Hello, ' + req.query.name));
app.get('/testPug', (req, res) => res.render("test", { name: "Charles" }));

// ---------- PRODUCTS ----------
// app.get('/prod', requireAuthUser, async (req, res) => {
//     try {
//         const result = await pool.query(
//             'SELECT p.id, p.name, p.price,' +
//             ' c.name as category_name ' +
//             'FROM shop.products p' +
//             ' LEFT JOIN shop.categories c ON p.category_id=c.id order by p.id');
//         const userRole = req.session.user.role;
//         res.render("products", { products: result.rows, userRole });
//     } catch (err) {
//         console.error("DB QUERY ERROR:", err);
//         res.status(500).send("Failed to fetch products");
//     }
// });
app.get('/prod', requireAuthUser, productController.getAllProducts)

app.get('/createProd', requireAuthAdmin, async (req, res) => {
    const result = await pool.query('SELECT * FROM shop.categories');    // Look at Promise
    console.log(result)
    res.render("productForm", {categories:result.rows});
});

app.post("/createProduct", requireAuthAdmin, upload_fields, async (req, res) => {
    console.log(req.body)
    const { name, price, category } = req.body;
    try {
        await pool.query(
            "INSERT INTO shop.products (id, name, price, category_id) VALUES (nextval('shop.products_seq'), $1, $2, $3)",
            [name, Number(price), Number(category)]
        );
        res.redirect("/prod");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating product");
    }
});
app.get("/catalogue", productController.getCatalogue)
app.get("/edit/:id", requireAuthAdmin, async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM shop.products WHERE id=$1', [id]);
        const categories = await pool.query('SELECT * FROM shop.categories');
        if (result.rows.length) {
            res.render("editProduct", { product: result.rows[0], categories: categories.rows });
        } else {
            res.render("error", { message: "Product not found", backURL: "/prod" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product");
    }
});

app.post("/editProduct", requireAuthAdmin, async (req, res) => {
    const { id, name, price, category } = req.body;
    try {
        await pool.query(
            'UPDATE shop.products SET name=$1, price=$2, category_id=$3 WHERE id=$4',
            [name, Number(price), Number(category), Number(id)]
        );
        res.redirect("/prod");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});

app.post("/delete/:id", requireAuthAdmin, async (req, res) => {
    const id = Number(req.params.id);
    try {
        await pool.query('DELETE FROM shop.products WHERE id=$1', [id]);
        res.redirect("/prod");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});
app.get('/register', (req, res) => {
    res.render("register")
})
app.post('/register', async (req, res) => {
    const passwordHash = await hashPassword(req.body.password);
    const name = req.body.name;

    if (!name || name.trim() === "") {
        return res.render("register", {
            message: "You must type in a username"
        });
    }

    const result = await pool.query(
        'SELECT * FROM shop.users WHERE name=$1',
        [name]
    );

    if (result.rows.length) {
        return res.render("register", {
            message: `User with name ${name} already exists`
        });
    }

    await pool.query(
        'INSERT INTO shop.users (name, password, role) VALUES ($1, $2, $3)',
        [name, passwordHash, "USER"]
    );

    return res.redirect("/auth?message=User%20created%20successfully");
});



app.post('/login', async (req, res) => {
    const valid = await verifyPassword(
        req.body.password,
        user.password_hash
    );
});
// ---------- AUTH ----------
app.get("/auth", (req, res) => {
    res.render("auth", { message: req.query.message });
});

app.post("/auth", async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM shop.users WHERE name=$1',
            [login]
        );
        console.log(result)
        if (result.rows.length) {
            const passwordVerify = await verifyPassword(password, result.rows[0].password)
            if(passwordVerify){
                req.session.user = result.rows[0];
                console.log(result.rows[0])
                const redirectPass = req.session.redirectPass || "/prod";
                res.redirect(redirectPass);
            }
            else{
                res.render("auth", { message: "User Invalid" });
            }
        } else {
            res.render("auth", { message: "User Invalid" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Authentication error");
    }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

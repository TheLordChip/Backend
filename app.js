import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import pkg from 'pg';
import methodOverride from 'method-override';

const { Pool } = pkg;
const app = express();
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
app.get('/prod', requireAuthUser, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shop.products');
        const userRole = req.session.user.role;
        res.render("products", { products: result.rows, userRole });
    } catch (err) {
        console.error("DB QUERY ERROR:", err);
        res.status(500).send("Failed to fetch products");
    }
});

app.get('/createProd', requireAuthAdmin, (req, res) => {
    res.render("productForm");
});

app.post("/createProduct", requireAuthAdmin, async (req, res) => {
    const { name, price } = req.body;
    try {
        await pool.query(
            "INSERT INTO shop.products (id, name, price) VALUES (nextval('shop.products_seq'), $1, $2)",
            [name, Number(price)]
        );
        res.redirect("/prod");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating product");
    }
});

app.get("/edit/:id", requireAuthAdmin, async (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM shop.products WHERE id=$1', [id]);
        if (result.rows.length) {
            res.render("editProduct", { product: result.rows[0] });
        } else {
            res.render("error", { message: "Product not found", backURL: "/prod" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching product");
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

// ---------- AUTH ----------
app.get("/auth", (req, res) => res.render("auth"));

app.post("/auth", async (req, res) => {
    const { login, password } = req.body;
    try {
        const result = await pool.query(
            'SELECT * FROM shop.users WHERE name=$1 AND password=$2',
            [login, password]
        );
        if (result.rows.length) {
            req.session.user = result.rows[0];
            const redirectPass = req.session.redirectPass || "/prod";
            res.redirect(redirectPass);
        } else {
            res.render("auth", { message: "User Invalid" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Authentication error");
    }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

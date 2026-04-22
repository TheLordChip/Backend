// Middleware to require a logged-in user
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
export function requireAuthUser(req, res, next) {
    if (req.session.user) {
        // User is logged in → proceed
        return next();
    }

    // Not logged in → remember original URL and redirect to login
    req.session.redirectPass = req.originalUrl;
    return res.redirect('/auth');
}


// Middleware to require an admin user
export function requireAuthAdmin(req, res, next) {
    const user = req.session.user;

    if (!user) {
        // Not logged in → remember original URL and redirect to login
        req.session.redirectPass = req.originalUrl;
        return res.redirect('/auth');
    }

    if (user.role === "ADMIN") {
        // Admin user → proceed
        return next();
    }

    // Logged in but not admin → show permission error
    return res.render("error", { message: "You don't have permission to view this page" });
}

export function requireAuthUserByJwt(req, res, next) {
   let token = req.headers.authorization
    console.log('token '+token);
    if (token && token.length > 0) {
        token = token.substring(7);
        if (jwt.verify(token, process.env.JWT_SECRET)) {
            return next();
        }
    }
    return res.status(401).send('Not authorized');
}




export function generateToken  (user)  {
    return jwt.sign({ name:user.name, role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

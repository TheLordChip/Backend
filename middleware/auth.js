// Middleware to require a logged-in user
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

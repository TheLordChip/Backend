// Function to require a logged-in user
export function requireAuthUser(req, res, next) {
    if (req.session.user) {
        next(); // user is logged in → continue
    } else {
        req.session.redirectPass = req.originalUrl;
        res.redirect('/auth'); // not logged in → send to login
    }
}

// Function to require an admin user
export function requireAuthAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === "ADMIN") {
        console.log("Logged in user:", req.session.user);
        return next(); // user is logged in → continue
    }
    if (req.session.user) {
        return res.render("error", { message: "You don't have permission to view this page" });
    }
    req.session.redirectPass = req.originalUrl;
    return res.redirect('/auth'); // not logged in → send to login
}

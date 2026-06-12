const User = require('../models/user');
const { getDuplicateField } = require('../utils/mongoErrors');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (err) {
        // A duplicate email surfaces as a raw E11000 from the unique
        // collation index on the shared talmadge-tech.users collection
        // (see models/user.js) - give it the same friendly message as
        // Athena-Web instead of the raw Mongo error text.
        const message = getDuplicateField(err) === 'email'
            ? 'An account with that email already exists. Try logging in instead.'
            : err.message;
        req.flash('error', message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    // Check if there was a return to URL, delete after use
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Successfully signed out!');
    res.redirect('/campgrounds');
}
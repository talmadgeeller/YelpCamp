const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const colors = require('./styles/styles')
const { dbUser, dbPass, dbName, hostname, port, sessionPass } = require('./auth/auth')
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const onlineDatabase = true;

if (onlineDatabase) {
    mongoose.connect(`mongodb://${hostname}/${dbName}?authSource=${dbUser}`, {
        user: dbUser,
        pass: dbPass
    });
} else mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log(colors['green'], "Database Connected");
});

// Launches express application
const app = express();

// Overrides the default ejs engine with ejsMate
app.engine('ejs', ejsMate);
// Allows HTML Templating with JS
app.set('view engine', 'ejs');
// Sets the views directory in relation to executing directory
app.set('views', path.join(__dirname, 'views'));
// Enables JSON view of data inserted into form
app.use(express.urlencoded({ extended: true }));
// Allows other HTTP requests outside of GET and POST
app.use(methodOverride('_method'));
// Allows express to serve static assets in the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Options for configuring the session store
const sessionConfig = {
    secret: sessionPass,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Set to expire 1 week from now
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}

app.use(session(sessionConfig));
// Enables flash messages
app.use(flash());

// Middleware to add flash messages to all response locals
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Forwards these URLs to their specific express routes
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// Handles HTTP routing for CRUD requests
app.get('/', (req, res) => {
    res.render('home');
});

// For every request, for every path
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Handles the errors passed into next by the above function
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(port, () => {
    console.log(colors['red'], 'Serving on port 3000');
});
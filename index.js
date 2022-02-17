require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const colors = require('./styles/styles');
const { DB_USER, DB_PASS, DB_NAME, HOSTNAME, PORT, SESSION_PASS } = process.env;
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');
//const helmet = require('helmet');
const MongoDBStore = require('connect-mongo');
const onlineDatabase = true;

if (onlineDatabase) {
    mongoose.connect(`mongodb://${HOSTNAME}/${DB_NAME}?authSource=${DB_USER}`,
        {
            user: DB_USER,
            pass: DB_PASS
        });
} else mongoose.connect(`mongodb://localhost:27017/${DB_NAME}`);

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
// Sanitizes queries
app.use(mongoSanitize({ replaceWith: '_' }));

const store = MongoDBStore.create({
    mongoUrl: `mongodb://${DB_USER}:${encodeURIComponent(DB_PASS)}@${HOSTNAME}/${DB_NAME}?authSource=${DB_USER}`,
    secret: SESSION_PASS,
    touchAfter: 24 * 3600
})

store.on("error", function (e) {
    console.log("Session Store Error", e);
});

// Options for configuring the session store
const sessionConfig = {
    store,
    name: 'session',
    secret: SESSION_PASS,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // Set to expire 1 week from now
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false
    }
}
console.log(sessionConfig.cookie.secure);

// Enables session storing, must be used before passport.session()
app.use(session(sessionConfig));
// Enables flash messages
app.use(flash());
// // Enables helmet for additional security
//app.use(helmet({ contentSecurityPolicy: false }));

// // Content security policy configuration
// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://cdn.jsdelivr.net/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/athena2021/",
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );

// Initializes passport for persistent login sessions
app.use(passport.initialize());
app.use(passport.session());
// Use local strategy to authenticate User
passport.use(new LocalStrategy(User.authenticate()));

// Tells passport how to serialize user based on User model
passport.serializeUser(User.serializeUser());
// Tells passport how to deserialize user based on User model
passport.deserializeUser(User.deserializeUser());

// Middleware to add flash messages to all response locals
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Forwards these URLs to their specific express routes
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

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

app.listen(PORT, () => {
    console.log(colors['red'], `Serving on port ${PORT}`);
});
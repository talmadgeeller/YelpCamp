const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const colors = require('./styles/styles')
const Campground = require('./models/campground');
const onlineDatabase = true;

if (onlineDatabase) {
    mongoose.connect('mongodb://talmadge.tech/yelp-camp?authSource=admin', {
        user: 'admin',
        pass: 'qAV6e05XJv1kYO1ZzGz3VPYPS'
    });
} else {
    mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        // Set options here
    });
}

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log(colors['green'], "Database Connected");
});

// Launches express application
const app = express();

// Allows HTML Templating with JS
app.set('view engine', 'ejs');
// Sets the views directory in relation to executing directory
app.set('views', path.join(__dirname, 'views'));
// Enables JSON view of data inserted into form
app.use(express.urlencoded({ extended: true }));
// Allows other HTTP requests outside of GET and POST
app.use(methodOverride('_method'));

// Handles HTTP routing for CRUD requests
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});

app.listen(3000, () => {
    console.log(colors['red'], 'Serving on port 3000');
});
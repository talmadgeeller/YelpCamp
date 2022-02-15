const Campground = require('../models/campground');
const mxbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mxbGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // Get geoData for the specified location
    const geoData = await geocoder.forwardGeocode(
        {
            query: req.body.campground.location,
            limit: 1
        }
    ).send();
    const campground = new Campground(req.body.campground);
    // Add geoData to the campground's geometry
    campground.geometry = geoData.body.features[0].geometry;
    // Add images returned from cloudinary upload
    campground.images = req.files.map(elem => ({ url: elem.path, filename: elem.filename }));
    // Set author to the signed in user
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created the ${campground.title} campground!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    // Gets the campground by id from the database
    const campground = await Campground.findById(req.params.id)
        // Populates object with the referenced review(s) and review author
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author'); // Populates the object with the referenced author
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const images = req.files.map(elem => ({ url: elem.path, filename: elem.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', `Successfully updated the ${campground.title} campground!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted campground!`);
    res.redirect('/campgrounds');
}
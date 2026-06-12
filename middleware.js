const { campgroundSchema, reviewSchema, userSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.trimAuthFields = (req, res, next) => {
    if (typeof req.body.username === 'string') req.body.username = req.body.username.trim();
    if (typeof req.body.email === 'string') req.body.email = req.body.email.trim();
    next();
}

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const message = error.details.map(elem => elem.message).join(',');
        throw new ExpressError(message, 400);
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store URL being requested
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const message = error.details.map(elem => elem.message).join(',');
        throw new ExpressError(message, 400);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(elem => elem.message).join(',');
        throw new ExpressError(message, 400);
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    // Authenticate
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

module.exports.isAuthorized = async (req, res, next) => {
    // Authenticate
    const validIDs = ['64009551bdf83c19b064cd2e', '6220bdc49da07c8132b0384d'];
    if (!validIDs.includes(req.user._id.valueOf())) {
        req.flash('error', 'You do not have permission to access that page!');
        return res.redirect(`/campgrounds`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    // Authenticate
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
const User = require('./user');
// Shorthand for typing mongoose.Schema
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: User
    },
    reviews: [
        {
            // Specifies this review array contains ObjectID's
            type: Schema.Types.ObjectId,
            // Specifies the reviews follow the 'Review' model
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popupMarkup').get(function () {
    return `<strong>
            <a href="/campgrounds/${this._id}">${this.title}</a>
            </strong>
            <p>
            ${this.description.substring(0, 20)}...
            </p>`;
});

// Delete associated reviews when deleting a campground
CampgroundSchema.post('findOneAndDelete', async function (camp) {
    // Delete all reviews with an id that is in the returned camp's reviews
    if (camp) await Review.deleteMany({ _id: { $in: camp.reviews } })
});

module.exports = mongoose.model('Campground', CampgroundSchema);
const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Review = require('./review');
// Shorthand for typing mongoose.Schema
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            // Specifies this review array contains ObjectID's
            type: Schema.Types.ObjectId,
            // Specifies the reviews follow the 'Review' model
            ref: 'Review'
        }
    ]
})

// Delete associated reviews when deleting a campground
CampgroundSchema.post('findOneAndDelete', async function (camp) {
    // Delete all reviews with an id that is in the returned camp's reviews
    if (camp) await Review.deleteMany({ _id: { $in: camp.reviews } })
});

module.exports = mongoose.model('Campground', CampgroundSchema);
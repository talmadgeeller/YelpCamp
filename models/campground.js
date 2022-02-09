const mongoose = require('mongoose');
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

module.exports = mongoose.model('Campground', CampgroundSchema);
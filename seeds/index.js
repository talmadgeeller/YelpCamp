const mongoose = require('mongoose');
const colors = require('../styles/styles')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { dbUser, dbPass, dbName, hostname } = require('./auth/auth')
const Campground = require('../models/campground');
const onlineDatabase = true;

if (onlineDatabase) {
    mongoose.connect(`mongodb://${hostname}/${dbName}?authSource=${dbUser}`, {
        user: dbUser,
        pass: dbPass
    });
} else {
    mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        // Set options here
    });
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(colors['green'], "Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log(colors['blue'], "Completed Data Insertion");
    mongoose.connection.close();
})
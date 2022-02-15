const mongoose = require('mongoose');
const colors = require('../styles/styles')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const { dbUser, dbPass, dbName, hostname } = require('../auth/auth')
const Campground = require('../models/campground');
const onlineDatabase = true;
const mxbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = 'pk.eyJ1IjoiaW52ZW50b3I5OCIsImEiOiJja3pvNGw3dGEyOXI5MnBzOGQ0eTlveXplIn0.pRSOEgYQQDduECJw5HrE0Q';
const geocoder = mxbGeocoding({ accessToken: mapBoxToken });
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

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

const imgArray = [
    'https://images.unsplash.com/photo-1470246973918-29a93221c455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NjYzOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1495732140334-940c8108c072?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NjY2Nw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1494081804123-85c06f3ba1f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NjY5Ng&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1478451870522-f4ab0193a26f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NjcyMw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1489657246911-07a06ecf3e28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njc2OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1500332988905-1bf2a5733f63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njc5OA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1497002928099-b7d092bc11b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njg0Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1500389783522-18c9d0d14cbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njg2NQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1502886227923-92453428325f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njg5OA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1490729316123-6db6e86afad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NjkyMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1484422911611-dda34f558628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njk2Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1499354271251-d2c2cf66568a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Njk4MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1501371417862-7d5ef8bf6ee3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzAyNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1444124818704-4d89a495bbae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzE2NA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1497303742222-d5f5b02a68be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzE4Ng&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1501703979959-797917eb21c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzEzNw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1484422911611-dda34f558628?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzI2Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1500220959218-81a28e9292d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzI4NA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1492010134797-571d37808136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzMwOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1483989942664-a80bb1eeb460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzMzMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1500765085688-0c5baefdb52a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzM3OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1494376863055-e18dd6c6841a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzQxNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1484026127540-d8fe960b53d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzQ0NQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1470010762743-1fa2363f65ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzQ4MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1496425745709-5f9297566b46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzUxMQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1502550736-b620fab08061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzU2NQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzU5MQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1503174768371-25049f8bf3f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzYxMg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1500370414137-9201565cf099?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzY3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1499875087559-ee0963a091c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzcwMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1499354271251-d2c2cf66568a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzc2Mg&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1494203547886-6d0ad9d15e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzc3OQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1494956913982-e8ef73bf707c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzgwMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzgxOQ&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1461978669748-37ff3558b346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzg0Ng&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1465695954255-a262b0f57b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzg2OA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1504744373149-59d6d64c86f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzg5OA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1499363536502-87642509e31b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3NzkyMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1444228250525-3d441b642d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3ODAyNA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://images.unsplash.com/photo-1496545672447-f699b503d270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDM3Nzk3Mw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080',
    'https://source.unsplash.com/collection/483251',
    'https://images.unsplash.com/photo-1496080174650-637e3f22fa03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHw0ODMyNTF8fHx8fHx8MTY0NDIwMTMzMA&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080'
]

const seedDB = async (req) => {
    await Campground.deleteMany({});
    for (let img of imgArray) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        // Get geoData for the specified location
        const geoData = await geocoder.forwardGeocode(
            {
                query: `${cities[random1000].city}, ${cities[random1000].state}`,
                limit: 1
            }
        ).send();
        const camp = new Campground({
            author: '6207a16155e4ea7bd649d810',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: img,
                    filename: null
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing' +
                'elit. Iure quidem, dignissimos voluptatibus a id officia. ' +
                'Perspiciatis, adipisci corporis. Omnis, quae nihil dolorem ' +
                'maxime eaque praesentium natus incidunt accusamus aspernatur',
            price,
            geometry: geoData.body.features[0].geometry
        })
        await camp.save();
    }
}

seedDB().then(() => {
    console.log(colors['blue'], "Completed Data Insertion");
    mongoose.connection.close();
})
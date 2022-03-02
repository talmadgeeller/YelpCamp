const mxbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mxbGeocoding({ accessToken: mapBoxToken });

const starMapConfig = (query) => {
    return {
        width: 0,
        // Customizations
        starColor: query.starColor || '#ffffff',
        starOpacity: query.starOpacity || 1,
        starSize: query.starSize || 7,
        backgroundColor: query.backgroundColor || '#000000',
        constellationColor: query.constellationColor || '#ffffff',
        constellationOpacity: query.constellationOpacity || 1,
        showConstellationLines: query.showConstellationLines || true,
        constellationWidth: query.constellationWidth || 1,
        graticuleColor: query.graticuleColor || '#ffffff',
        graticuleOpacity: query.graticuleOpacity || 0.35,
        showGraticule: query.showGraticule || true,
        graticuleWidth: query.graticuleWidth || 0.6,
        graticuleDash: query.graticuleDash || 1,
        latitude: query.latitude || 39.434,
        longitude: query.longitude || -77.096,
        year: query.year || 2021,
        month: query.month || 10,
        day: query.day || 16,
        hour: query.hour || 0,
        minute: query.minute || 0
    }
}

module.exports.showMap = (req, res) => {
    const query = req.query;
    res.render('stars/generator', starMapConfig(query));
};

module.exports.renderCreateForm = (req, res) => {
    res.render('stars/customizer');
}

module.exports.createStarMap = async (req, res, next) => {
    // Get geoData for the specified location
    const geoData = await geocoder.forwardGeocode(
        {
            query: req.body.config.location,
            limit: 1
        }
    ).send();
    const config = req.body.config;
    // Add geoData to the config's geometry
    const coordinates = geoData.body.features[0].geometry.coordinates;
    config.latitude = coordinates[1];
    config.longitude = coordinates[0];
    // Set author to the signed in user
    config.author = req.user._id;
    req.flash('success', `Successfully created the custom star map!`);
    const queryString = generateQueryString(config, req.body.exportData);
    res.redirect(`/stars${queryString}`);
}

function generateQueryString(queryObj, exportData) {
    let queryString = "";
    if (exportData !== "") {
        queryString += `?${exportData}`;
    }
    Object.keys(queryObj).forEach(function (key) {
        let sym = queryString === "" ? "?" : "&";
        const value = queryObj[key];
        if (value !== "" && !queryString.includes(key)) {
            if (key === "date") {
                if (!queryString.includes("year")) {
                    const dates = value.split('-');
                    queryString += `${sym}year=${dates[0]}`;
                    queryString += `&month=${dates[1]}`;
                    queryString += `&day=${dates[2]}`;
                }
            }
            else if (key === "time") {
                if (!queryString.includes("hour")) {
                    const times = value.split(':');
                    queryString += `${sym}hour=${times[0]}`;
                    queryString += `&minute=${times[1]}`;
                }
            }
            else queryString += `${sym}${key}=${value}`;
        }
    });
    return queryString.replace('#', '%23');
}
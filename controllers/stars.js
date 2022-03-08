const starMapConfig = (query) => {
    return {
        width: query.width || 0,
        // Customizations
        starColor: query.starColor || '#ffffff',
        starOpacity: query.starOpacity || 1,
        starSize: query.starSize || 11,
        backgroundColor: query.backgroundColor || '#000000',
        outlineColor: query.outlineColor || '#ffffff',
        outlineWidth: query.outlineWidth || 14,
        constellationColor: query.constellationColor || '#ffffff',
        constellationOpacity: query.constellationOpacity || 0.425,
        showConstellationLines: query.showConstellationLines || true,
        constellationWidth: query.constellationWidth || 2,
        graticuleColor: query.graticuleColor || '#ffffff',
        graticuleOpacity: query.graticuleOpacity || 0.6,
        showGraticule: query.showGraticule || true,
        graticuleWidth: query.graticuleWidth || 0.6,
        graticuleDash: query.graticuleDash || 1,
        latitude: query.latitude || 39.434,
        longitude: query.longitude || -77.096,
        locationName: query.locationName || "MOUNT AIRY, MD, USA",
        customSaying: query.customSaying || "",
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
    const config = req.body.config;
    if (config.location) {
        const location = JSON.parse(config.location);
        const coord = JSON.parse(location.coordinates);
        config.latitude = coord[1];
        config.longitude = coord[0];
    }
    let exportData = req.body.exportData;
    if (exportData)
        exportData = JSON.parse(exportData);
    req.flash('success', `Successfully created the custom star map!`);
    const queryString = generateQueryString(config, exportData);
    res.redirect(`/stars${queryString}`);
}

function generateQueryString(queryObj, exportData) {
    let queryString = "";
    if (exportData !== "") {
        Object.keys(exportData).forEach(function (key) {
            let sym = queryString === "" ? "?" : "&";
            const value = exportData[key];
            queryString += `${sym}${key}=${value}`;
        });
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
    return queryString.replaceAll('#', '%23');
}
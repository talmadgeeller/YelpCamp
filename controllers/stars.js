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
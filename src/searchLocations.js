const geolib = require('geolib');

exports.searchLocations = (latitude, longitude) => {
    const filterEventsByDistance = (event) => {
        if (!event || !event.payload) {
            return false;
        }
        const parts = event.payload.split(',');
        let coordenate = {};
        coordenate.latitude = parseFloat(parts[2]);
        coordenate.longitude = parseFloat(parts[3].replace('<', ''));
        const referenceCoordinate = { latitude: latitude, longitude: longitude };
        const distance = geolib.getPreciseDistance(referenceCoordinate, coordenate, 0.01);
        return distance < 50;
    }
    return filterEventsByDistance;
}
const { program } = require('commander');
const { csvProcessor } = require("./csvProcessor");
const geolib = require('geolib');

program
    .requiredOption('--location <location>', 'Location to search for (format: latitude,longitude)')
    .requiredOption('--file <file>', 'Path to the CSV file')
    .parse(process.argv);

const filterEventsByRadius = (event) => {
    if (!event || !event.payload) {
        return false;
    }
    const parts = event.payload.split(',');
    let coordenate = {};
    coordenate.latitude = parseFloat(parts[2]);
    coordenate.longitude = parseFloat(parts[3].replace('<', ''));
    const distance = geolib.getPreciseDistance(referenceCoordinate, coordenate, 0.01);
    return distance < 50;
}

const main = async () => {
    referenceCoordinate = { latitude: parseFloat("-23.70041"), longitude: parseFloat("-046.53713") };
    let dataCSV = [];
    try {
        dataCSV = await csvProcessor.readFile("eventlog.csv", filterEventsByRadius);
    } catch (error) {
        console.log(error);
    }
    // const filteredData = filterEventsByRadius(dataCSV);
    const header = [
        { id: 'device', title: 'Device' },
        { id: 'prfix', title: 'Prefix' },
        { id: 'instant', title: 'Instant' },
        { id: 'payload', title: 'Payload' },
        { id: 'company', title: 'Company' }]
    await csvProcessor.createFileCSV(dataCSV, header);
};

main();
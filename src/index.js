const { program } = require('commander');
const { csvProcessor } = require("./csvProcessor");
const geolib = require('geolib');

const init = async () => {
    program
    .requiredOption('--location <location>', 'Location to search for (format: latitude,longitude)')
    .requiredOption('--file <file>', 'Path to the CSV file')
    .parse(process.argv);
};

const inputParams = {};

const filterEventsByDistance = (event) => {
    if (!event || !event.payload) {
        return false;
    }
    const parts = event.payload.split(',');
    let coordenate = {};
    coordenate.latitude = parseFloat(parts[2]);
    coordenate.longitude = parseFloat(parts[3].replace('<', ''));
    const distance = geolib.getPreciseDistance(inputParams.referenceCoordinate, coordenate, 0.01);
    return distance < 50;
}

const main = async () => {
    await init();
    inputParams.referenceCoordinate = program.getOptionValue("location");
    const parts = inputParams.referenceCoordinate.split(',');
    inputParams.referenceCoordinate =  { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) };
    inputParams.file = program.getOptionValue("file");
    let dataCSV = [];
    try {
        dataCSV = await csvProcessor.readFile(inputParams.file, filterEventsByDistance);
    } catch (error) {
        console.log(error);
    }
    const header = [
        { id: 'device', title: 'Device' },
        { id: 'prfix', title: 'Prefix' },
        { id: 'instant', title: 'Instant' },
        { id: 'payload', title: 'Payload' },
        { id: 'company', title: 'Company' }]
    await csvProcessor.createFileCSV(dataCSV, header);
};

main();
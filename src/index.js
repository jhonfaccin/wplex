const { program } = require('commander');
const { csvProcessor } = require("./csvProcessor");
const geolib = require('geolib');

const init = async () => {
    program
    .requiredOption('--location <location>', 'Location to search for (format: latitude,longitude)')
    .requiredOption('--file <file>', 'Path to the CSV file')
    .parse(process.argv);
};


const searchLocations = (latitude, longitude ) =>{
	const filterEventsByDistance = (event) => {
		if (!event || !event.payload) {
			return false;
		}
		const parts = event.payload.split(',');
		let coordenate = {};
		coordenate.latitude = parseFloat(parts[2]);
		coordenate.longitude = parseFloat(parts[3].replace('<', ''));
		const referenceCoordinate ={latitude: latitude, longitude:longitude};
		const distance = geolib.getPreciseDistance(referenceCoordinate, coordenate, 0.01);
		return distance < 50;
	}

	return filterEventsByDistance;
}

const main = async () => {
    await init();
    const inputParams = {};
    inputParams.referenceCoordinate = program.getOptionValue("location");
    const parts = inputParams.referenceCoordinate.split(',');
    inputParams.referenceCoordinate =  { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) };
    inputParams.file = program.getOptionValue("file");
    let dataCSV = [];
    try {
        dataCSV = await csvProcessor.readFile(inputParams.file, searchLocations(inputParams.referenceCoordinate.latitude, inputParams.referenceCoordinate.longitude));
    } catch (error) {
        console.log(error);
    }
    const header = [
        { id: 'device', title: 'Device' },
        { id: 'prefix', title: 'Prefix' },
        { id: 'instant', title: 'Instant' },
        { id: 'payload', title: 'Payload' },
        { id: 'company', title: 'Company' }]
    await csvProcessor.createFileCSV(dataCSV, header);
};

main();
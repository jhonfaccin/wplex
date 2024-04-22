const { program } = require('commander');
const { dataService } = require("./dataService");

const init = async () => {
    program
        .requiredOption('--location <location>', 'Location to search for (format: latitude,longitude)')
        .option('--file <file>', 'Path to the CSV file')
        .parse(process.argv);
};

const main = async () => {
    await init();
    const inputParams = {};
    inputParams.referenceCoordinate = program.getOptionValue("location");
    const parts = inputParams.referenceCoordinate.split(',');
    inputParams.referenceCoordinate = { latitude: parseFloat(parts[0]), longitude: parseFloat(parts[1]) };
    inputParams.file = program.getOptionValue("file");
    inputParams.file = inputParams.file || "eventlog.csv";
    const dataCSV = await dataService.getLocationData(inputParams.referenceCoordinate, inputParams.file);
    const header = [
        { id: 'device', title: 'Device' },
        { id: 'prefix', title: 'Prefix' },
        { id: 'instant', title: 'Instant' },
        { id: 'payload', title: 'Payload' },
        { id: 'company', title: 'Company' }
    ];
    await dataService.createFile(dataCSV, header);
};

main();
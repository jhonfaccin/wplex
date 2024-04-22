const { csvProcessor } = require("./csvProcessor");
const {searchLocations} = require("./searchLocations");

const getLocationData = async (location, file) => {
    const latitude = parseFloat(location.latitude);
    const longitude = parseFloat(location.longitude);

    const filterFunction = searchLocations(latitude, longitude);
    let dataCSV = [];

    try {
        dataCSV = await csvProcessor.readFile(file, filterFunction);
    } catch (error) {
        throw Error('Error reading CSV:', error);
    }
    return dataCSV;
}

const createFile = async (data, header) => {
    try {
        await csvProcessor.createFileCSV(data, header);
    } catch (error) {
        throw Error('Error writing CSV:', error);
    }
}

module.exports = {
    dataService: {
        getLocationData,
        createFile
    }
};

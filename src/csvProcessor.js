const csv = require('csv-parser');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

const readFile = async (file,filterFunction) => {
    return new Promise((resolve, reject) => {
        const dataCSV = [];
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => {
                if (filterFunction && filterFunction(data)) {
                    dataCSV.push(data);
                } else if (filterFunction === undefined){
                    dataCSV.push(data);
                }
            })
            .on('end', () => {
                resolve(dataCSV);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


const createFileCSV = async (data, header) => {
    data.sort((a, b) => {
        if (a.device === b.device) {
            return new Date(b.instant) - new Date(a.instant);
        }
        return a.device.localeCompare(b.device);
    });
    const writer = csvWriter({
        path: 'output.csv',
        header: header
    });
    const writeStream = fs.createWriteStream('output.csv');

    writer.writeRecords(data) 
        .then(() => {
            console.log('CSV file created successfully');
        })
        .catch((err) => {
            throw Error('Error writing CSV:', err);
        });
    writeStream.end();

}

module.exports = {
    csvProcessor: {
        readFile,
        createFileCSV
    }
};

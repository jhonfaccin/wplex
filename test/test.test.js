
const { dataService } = require("../src/dataService");
const { csvProcessor } = require("../src/csvProcessor");
const fs = require('fs');


test("should any file", async () => {
    const location = { latitude: 10, longitude: 20 };
    const file = "eventlog.csv";
    const dataCSV = await dataService.getLocationData(location, file);
    expect(dataCSV).not.toBeNull();
});

test("should not existing file", async () => {
    const location = { latitude: 10, longitude: 20 };
    const file = "test.csv";
    await expect(dataService.getLocationData(location, file)).rejects.toThrowError("Error reading CSV:");
});

test("should a file", async () => {
    const location = { latitude: -23.70041, longitude: -46.53713 };
    const file = "eventlog.csv";
    const dataCSV = await dataService.getLocationData(location, file);
    expect(dataCSV.length).toBe(11);
});

test("should not create file", async () => {
    const header = [
        { id: 'device', title: 'Device' },
        { id: 'prefix', title: 'Prefix' },
        { id: 'instant', title: 'Instant' },
        { id: 'payload', title: 'Payload' },
        { id: 'company', title: 'Company' }
    ];
    const file = "test.aaa";
    await expect(dataService.createFile(file, header)).rejects.toThrowError("Error writing CSV:");
});
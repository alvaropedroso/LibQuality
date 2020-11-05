/**
 * @jest-environment node
 */

const MockAdapter = require("axios-mock-adapter");
const axios = require('axios');
const { map } = require("mathjs");
const fs = require('fs');
const path = require('path');
var mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

const mockUrl = /^https:\/\/api\.github\.com\/*/;
const regexMap = [
    { request: 'Issue', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)\/issues.*$/ },
    { request: 'Contributors', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)\/contributors.*$/ },
    { request: 'Repository', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)$/ },
    { request: 'Search', regex: /^https:\/\/api\.github\.com\/search\/repositories.*/ },
];

function checkRequestType(URL) {
    const match = regexMap.map(
        (regexItem) => ({ request: regexItem.request, match: URL.match(regexItem.regex) })
    ).find((regexMatch) => regexMatch.match);
    return match;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

beforeAll(async () => {
    // const {startupDB} =  require('../src/model/startModules.js');
    // await startupDB();
    jest.setTimeout(20000);
    require('../index');
    await sleep(2000);

})

let mockName, calls={};

mock.onAny(mockUrl).reply((config) => {
    const type = checkRequestType(config.url);
    let data = {}, status = 200;
    if (mockName === 'Get repository info happy path') {
        if (type.request === 'Issue') {
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mocks/first/issues1.mock.json')));
        } else if (type.request === 'Contributors') {
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mocks/first/contributors1.mock.json')));
        } else if (type.request === 'Repository') {
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mocks/first/repository1.mock.json')));
        } else {
            status = 500;
        }
    } else if (mockName === 'Repository Not Found') {
        if (type.request === 'Repository') {
            data = {
                "message": 'Not Found'
            };
        } else if (type.request === 'Search') {
            data = {
                "total_count": 0,
                "incomplete_results": false,
                "items": [
                ]
            }
        }
    } else if (mockName === 'Repository call error') {
        status = 500
    } else if (mockName === 'Repository More than 100 issues') {
        if (type.request === 'Issue') {
            if(!calls.issue){
                calls.issue = 1;
            }
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./mocks/moreThan100/issues${calls.issue}.mock.json`)));
            calls.issue++;
        } else if (type.request === 'Contributors') {
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mocks/moreThan100/contributors1.mock.json')));
        } else if (type.request === 'Repository') {
            data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './mocks/moreThan100/repository1.mock.json')));
        } else {
            status = 500;
        }
    }

    return [status, data];
});


describe("getRepositoryInfo", () => {
    test("Get repository info happy path", async () => {
        mockName = "Get repository info happy path";
        calls={};
        const response = await axios.get('http://localhost:3000/getRepoInfo/testName/angular/angular');
        const { data } = response;
        expect(data).toHaveProperty('project');
        expect(data).toHaveProperty('owner');
        expect(data).toHaveProperty('openIssues');
        expect(data).toHaveProperty('avgAge');
        expect(data).toHaveProperty('stdAge');
    });

    test("GET Repository Not Found", async () => {
        mockName = 'Repository Not Found';
        calls={};
        try {
            await axios.get('http://localhost:3000/getRepoInfo/testName/angular/angular');
            expect(true).toBe(false);
        } catch (err) {
            expect(err.response.status).toBe(404);
            expect(err.response.data).toBe('Repository not found');
        }
    });

    test("GET Repository call error", async () => {
        mockName = 'Repository call error';
        calls={};
        try {
            await axios.get('http://localhost:3000/getRepoInfo/testName/angular/angular');
            expect(true).toBe(false);
        } catch (err) {
            expect(err.response.status).toBe(500);
            expect(err.response.data).toBe('Error getting repository data');
        }
    });

    test("GET More than 100 issues", async () => {
        mockName = 'Repository More than 100 issues';
        calls={};
        const response = await axios.get('http://localhost:3000/getRepoInfo/testName/angular/angular');
        const { data } = response;
        expect(data).toHaveProperty('project');
        expect(data).toHaveProperty('owner');
        expect(data).toHaveProperty('openIssues');
        expect(data).toHaveProperty('avgAge');
        expect(data).toHaveProperty('stdAge');

    });

    test("Search Repository Not Found", async () => {
        mockName = 'Repository Not Found';
        calls={};
        try {
            await axios.get('http://localhost:3000/getRepoInfo/testName/angular');
            expect(true).toBe(false);
        } catch (err) {
            expect(err.response.status).toBe(404);
            expect(err.response.data).toBe('Repository not found');
        }
    });

    test("Search Repository call error", async () => {
        mockName = 'Repository call error';
        calls={};
        try {
            await axios.get('http://localhost:3000/getRepoInfo/testName/angular/angular');
            expect(true).toBe(false);
        } catch (err) {
            expect(err.response.status).toBe(500);
            expect(err.response.data).toBe('Error getting repository data');
        }
    });
});
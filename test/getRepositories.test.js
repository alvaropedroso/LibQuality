/**
 * @jest-environment node
 */

const MockAdapter = require("axios-mock-adapter");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const appSetup = require("../appSetup");
var mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

const mockUrl = /^https:\/\/api\.github\.com\/*/;
const regexMap = [
    { request: 'issues', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)\/issues.*$/ },
    { request: 'contributors', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)\/contributors.*$/ },
    { request: 'repository', regex: /^https:\/\/api\.github\.com\/repos\/(\w+)\/(\w+)$/ },
    { request: 'searchRepo', regex: /^https:\/\/api\.github\.com\/search\/repositories.*/ },
];

function checkRequestType(URL) {
    const match = regexMap.map(
        (regexItem) => ({ request: regexItem.request, match: URL.match(regexItem.regex) })
    ).find((regexMatch) => regexMatch.match);
    return match;
}

beforeAll(async () => {
    jest.setTimeout(20000);
    await appSetup();

})

let mockFiles, calls={};

function getMockFromFile(type){
    if(!calls[type.request]){
        calls[type.request] = 1;
    }
    console.log("pathhhhhhhh:",path.resolve(__dirname, `./mocks/${mockFiles}/${type.request}${calls[type.request]}.mock.json`));
    data = JSON.parse(fs.readFileSync(path.resolve(__dirname, `./mocks/${mockFiles}/${type.request}${calls[type.request]}.mock.json`)));
    calls[type.request]++;
    return data;
}

mock.onAny(mockUrl).reply((config) => {
    const type = checkRequestType(config.url);
    let data = {}, status = 200;
    if (mockFiles === 'Repository call error') {
        status = 500;
    } else {
        data = getMockFromFile(type);
    }

    return [status, data];
});


describe("getRepositoryInfo", () => {
    test("Get repository info happy path", async () => {
        mockFiles = "HappyPath";
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
        mockFiles = 'RepositoryNotFound';
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
        mockFiles = 'Repository call error';
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
        mockFiles = 'moreThan100';
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
        mockFiles = 'RepositoryNotFound';
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
        mockFiles = 'Repository call error';
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
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


describe("Library statistics", () => {
    test("Lib statistics integration tests", async () => {
        mockFiles = "HappyPath";
        calls={};
        //adding lib to user
        await axios.put('http://localhost:3000/libStatistics/testName/facebook/react');

        //getting user libs
        let response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        let { data } = response;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(1);
        expect(data.repositories[0]).toHaveProperty('owner');
        expect(data.repositories[0]).toHaveProperty('name');
        expect(data.repositories[0].repositoryLogs).toHaveLength(0);

        //endpoint created for tests to simulate cron execution
        await axios.get('http://localhost:3000/libStatistics/generateData');

        //getting user libs
        response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        data = response.data;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(1);
        expect(data.repositories[0]).toHaveProperty('owner');
        expect(data.repositories[0]).toHaveProperty('name');
        expect(data.repositories[0].repositoryLogs).toHaveLength(1);
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('open_issues_count');
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('avgAge');
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('stdAge');

        //adding lib to user
        await axios.delete('http://localhost:3000/libStatistics/testName/facebook/react');

        //getting user libs
        response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        data = response.data;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(0);

        //adding lib back to user
        await axios.put('http://localhost:3000/libStatistics/testName/facebook/react');

        mockFiles = "moreThan100";
        calls={};
        //using again endpoint created for tests to simulate cron execution
        await axios.get('http://localhost:3000/libStatistics/generateData');
        
        //getting user libs
        response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        data = response.data;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(1);
        expect(data.repositories[0]).toHaveProperty('owner');
        expect(data.repositories[0]).toHaveProperty('name');
        expect(data.repositories[0].repositoryLogs).toHaveLength(2);
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('open_issues_count');
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('avgAge');
        expect(data.repositories[0].repositoryLogs[0]).toHaveProperty('stdAge');
        expect(data.repositories[0].repositoryLogs[1]).toHaveProperty('open_issues_count');
        expect(data.repositories[0].repositoryLogs[1]).toHaveProperty('avgAge');
        expect(data.repositories[0].repositoryLogs[1]).toHaveProperty('stdAge');

        //adding lib to user
        await axios.delete('http://localhost:3000/libStatistics/testName/facebook/react');
    })

    test("multiple repositories", async () => {
        mockFiles = "HappyPath";
        calls={};
        //adding libs to user
        await axios.put('http://localhost:3000/libStatistics/testName/facebook/react');
        await axios.put('http://localhost:3000/libStatistics/testName/angular/angular');

        //getting user libs
        let response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        let { data } = response;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(2);
        expect(data.repositories[0]).toHaveProperty('owner');
        expect(data.repositories[0].owner).toBe('facebook');
        expect(data.repositories[0]).toHaveProperty('name');
        expect(data.repositories[0].name).toBe('react');
        let repo0logLength =  data.repositories[0].repositoryLogs.length;
        console.log('repo0logLength',repo0logLength);
        expect(data.repositories[1]).toHaveProperty('owner');
        expect(data.repositories[1].owner).toBe('angular');
        expect(data.repositories[1]).toHaveProperty('name');
        expect(data.repositories[1].name).toBe('angular');
        let repo1logLength =  data.repositories[1].repositoryLogs.length;
        console.log('repo1logLength',repo1logLength);

        //endpoint created for tests to simulate cron execution
        await axios.get('http://localhost:3000/libStatistics/generateData');

        //getting user libs
        response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        data = response.data;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(2);
        expect(data.repositories[0]).toHaveProperty('owner');
        expect(data.repositories[0]).toHaveProperty('name');
        expect(data.repositories[0].repositoryLogs).toHaveLength(repo0logLength+1);
        expect(data.repositories[0].repositoryLogs[repo0logLength]).toHaveProperty('open_issues_count');
        expect(data.repositories[0].repositoryLogs[repo0logLength]).toHaveProperty('avgAge');
        expect(data.repositories[0].repositoryLogs[repo0logLength]).toHaveProperty('stdAge');
        expect(data.repositories[1]).toHaveProperty('owner');
        expect(data.repositories[1]).toHaveProperty('name');
        expect(data.repositories[1].repositoryLogs).toHaveLength(repo1logLength+1);
        expect(data.repositories[1].repositoryLogs[repo1logLength]).toHaveProperty('open_issues_count');
        expect(data.repositories[1].repositoryLogs[repo1logLength]).toHaveProperty('avgAge');
        expect(data.repositories[1].repositoryLogs[repo1logLength]).toHaveProperty('stdAge');

        //adding lib to user
        await axios.delete('http://localhost:3000/libStatistics/testName/facebook/react');
        await axios.delete('http://localhost:3000/libStatistics/testName/angular/angular');

        //getting user libs
        response = await axios.get('http://localhost:3000/libStatistics/testName/userLibs');
        data = response.data;
        expect(data).toHaveProperty('username');
        expect(data).toHaveProperty('repositories');
        expect(data.repositories).toHaveLength(0);
    })
});
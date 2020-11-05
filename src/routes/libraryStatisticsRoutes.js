const express = require('express');
const route = express.Router();
const { deleteLib, getLibsInfo, saveNewLib } = require('../business/libStatistics');
const { generateRepositoryStatisticsData } = require('../business/repositoryInfo');


route.put('/:username/:owner/:repoName', async function (req, res) {
    const response = await saveNewLib(req.params.owner, req.params.repoName, req.params.username);
    res.send(response);
});

route.delete('/:username/:owner/:repoName', async function (req, res) {
    const response = await deleteLib(req.params.owner, req.params.repoName, req.params.username);
    res.send('response');
});

route.get('/generateData', async function (req, res) {
    const response = await generateRepositoryStatisticsData();
    res.send(response);
});

route.get('/:username/userLibs/', async function (req, res) {
    const response = await getLibsInfo(req.params.username);
    res.send(response);
});

module.exports = route;
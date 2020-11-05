const express = require('express');
const route = express.Router();
const { deleteLib, getLibsInfo, saveNewLib } = require('../business/libStatistics');
const { generateRepositoryStatisticsData } = require('../business/repositoryInfo');


route.put('/:username/:owner/:repoName', async function (req, res) {
    try{
        const response = await saveNewLib(req.params.owner, req.params.repoName, req.params.username);
        res.send(response);
    } catch (err) {
        if(err.message === 'Repository not found'){
            res.status(404);
        } else {
            res.status(500);
        }
        res.send(err.message);
    }
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
    try {
        const response = await getLibsInfo(req.params.username);
        res.send(response);
    } catch (err) {
        if(err.message === 'Repository not found'){
            res.status(404);
        } else {
            res.status(500);
        }
        res.send(err.message);
    }
});

module.exports = route;
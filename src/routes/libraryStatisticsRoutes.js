const express = require('express');
const route = express.Router();
const {deleteLib,getLibsInfo,saveNewLib, generateData} = require('../business/libStatistics');


route.put('/:owner/:repo/:username', async function (req, res) {
    const response = await saveNewLib(req.params.owner, req.params.repo, req.params.username);
    res.send(response);
});

route.delete('/:owner/:repo/:username', async function (req, res) {
    const response = await deleteLib(req.params.owner, req.params.repo, req.params.username);
    res.send('response');
});

route.get('/generateData', async function (req, res) {
    const response = await generateData();
    res.send(response);
});

route.get('/userLibs/:username', async function (req, res) {
    const response = await getLibsInfo(req.params.username);
    res.send(response);
});

module.exports = route;
const express = require('express');
const route = express.Router();
const getReposioryInfo = require('../business/getRepositoryInfo');


route.put('/:owner/:repo/:username', async function (req, res) {
    const response = await saveNewLib(req.params.repo);
    res.send(response.toString);
});

route.delete('/:owner/:repo/:username', function (req, res) {
    const response = await deleteLib(req.params.repo);
    res.send('user ' + req.params.user);
});

route.get('/:username', async function (req, res) {
    const response = await getLibsInfo(req.params.repo);
    res.send(response.toString);
});

module.exports = route;
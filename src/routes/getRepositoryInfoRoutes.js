const express = require('express');
const route = express.Router();
const { getRepositoryInfo, searchRepositoryInfo } = require('../business/repositoryInfo');

route.get('/:username/:query', async function (req, res) {
    try {
        const response = await searchRepositoryInfo(req.params.query, req.params.username);
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

route.get('/:username/:owner/:repoName', async function (req, res) {
    try {
        const response = await getRepositoryInfo(req.params.owner, req.params.repoName, req.params.username);
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
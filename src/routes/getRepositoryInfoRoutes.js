const express = require('express');
const route = express.Router();
const { getRepositoryInfo, searchRepositoryInfo} = require('../business/repositoryInfo');

route.get('/:username/:query', async function(req, res) {
  const response = await searchRepositoryInfo(req.params.query,req.params.username);
  res.send(response);
});

route.get('/:username/:owner/:repoName', async function(req, res) {
  const response = await getRepositoryInfo(req.params.owner,req.params.repoName,req.params.username);
  res.send(response);
});


module.exports = route;
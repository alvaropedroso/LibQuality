const express = require('express');
const route = express.Router();
const { getRepositoryInfo, searchRepositoryInfo} = require('../business/repositoryInfo');

route.get('/:query/:username', async function(req, res) {
  const response = await searchRepositoryInfo(req.params.query,req.params.username);
  console.log(response)
  res.send(response);
});

route.get('/:owner/:repo/:username', async function(req, res) {
  const response = await getRepositoryInfo(req.params.owner,req.params.repo,req.params.username);
  console.log(response)
  res.send(response);
});


module.exports = route;
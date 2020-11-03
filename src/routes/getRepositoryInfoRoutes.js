const express = require('express');
const route = express.Router();
const { getRepositoryInfo, searchRepositoryInfo} = require('../business/repositoryInfo');

route.get('/:query', async function(req, res) {
  const response = await searchRepositoryInfo(req.params.query);
  console.log(response)
  res.send(response);
});

route.get('/:owner/:repo', async function(req, res) {
  const response = await getRepositoryInfo(req.params.owner,req.params.repo);
  console.log(response)
  res.send(response);
});


module.exports = route;
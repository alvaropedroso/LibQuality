const express = require('express');
const route = express.Router();
const getReposioryInfo = require('../business/getRepositoryInfo');

route.get('/:query', async function(req, res) {
  const response = await getReposioryInfo(req.params.query);
  console.log(response)
  res.send(response);
});

route.get('/:owner/:repo', async function(req, res) {
  const response = await getReposioryInfo(req.params.owner + '/' + req.params.repo);
  console.log(response)
  res.send(response);
});


module.exports = route;
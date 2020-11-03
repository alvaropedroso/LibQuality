// LibQuality will collect metrics from GitHub projects and make them available in a consolidated dashboard. End users can query by Project name (like “React”) then they will see a #issues, average, and standard deviation time.

// Phase 1

// Product Owner wants to know how many issues are currently opened for a given GitHub project and how long the issues are opened. Basically, the bottom table in the wireframe. 

// Besides that, LibQuality should keep track of searches by project and by user visit. These data will be used later to create new features, however, in Phase 1 it should start being collected.



// Phase 2
// Product Owner wants users to be able to see statistics about a set of libraries (that they choose) along time, day over day. In other words, a line chart should be displayed to end-users so they can see how the library team is handling their issues along project life.



// Phase 3 (not for implement in this test, only use as requirement when designing architecture)
// Product Owner envision seeing other metrics like stars(stargazers_count), forks(forks_count), #contributors(https://api.github.com/repos/facebook/react/contributors), and also allow users to see issues grouped by GitHub labels(https://api.github.com/repos/facebook/react/issues). We enforce that users will start to make requests after Phase I.



// Notes

// You are responsible for designing and implementing the backend in Node of LibQuality.
// Considering this scenario is downright expected that the architecture of this project allows it to grow healthy to fulfill new requirements.



// Your assignment:

// You must design and present the architecture for LibQuality service. It does not need to be too sophisticated, but you must explain each element of it. Use flows and text to explain the architecture you designed. 
// You must design and document LibQuality API to support the features described (it could be MD files, swagger, or whatever you find most appropriated)
// You must implement LibQuality service using Node 10+. You can decide which framework/libraries to use.
//           3.1  Phase I is mandatory

//           3.2 Phase II is a nice to have

//           3.3 Phase III does not need to be implemented

// You must write tests.
// You must write README.md file with all steps required to develop and test and deploy your code – make it simple.
//        2.1 If necessary, create a docker-compose to setup all external services required to run LibQuality in development mode.



// Rules:

//  You have 1 week to complete this test.
// You must use GitHub API https://developer.github.com/v3/ to collect raw data.
// As soon as you finish your test you must generate a git tag named venturus-1.0.0.This tag must be generated before the end date of the test and will be used to evaluate your test.
// When you are done, create a public repository on Github and submit the code for evaluation. 



const axios = require('axios');
const math = require('mathjs');
const db = require('./dbConnection');
const express = require ('express');
const app = express();
app.listen(3000);
app.use('/getRepoInfo', require('./routes/getRepositoryInfoRoutes'));
app.use('/libStatistics', require('./routes/libraryStatisticsRoutes'));
 
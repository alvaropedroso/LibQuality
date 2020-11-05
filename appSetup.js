module.exports = async function appSetup(){
    const schedule = require('node-schedule');
    const express = require ('express');
    const { startupDB } = require('./src/model/startModules');
    
    await startupDB();
    const app = express();
    app.listen(3000);
    app.use('/getRepoInfo', require('./src/routes/getRepositoryInfoRoutes'));
    app.use('/libStatistics', require('./src/routes/libraryStatisticsRoutes'));
    
    const { generateRepositoryStatisticsData } = require('./src/business/repositoryInfo');
    schedule.scheduleJob({ rule: '0 0 8 * * *' }, () => {
        generateRepositoryStatisticsData();
    });
}
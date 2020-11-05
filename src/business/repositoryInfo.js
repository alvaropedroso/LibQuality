const math = require('mathjs');
//Requests
const searchRepositories = require('../requests/searchRepositories');
const getAllRepoIssues = require('../requests/getAllRepoIssues');
const getAllContributors = require('../requests/getAllContributors');
const getRepository = require('../requests/getRepository');
//Model
const { Issue, Repository, RepositoryLog, User } = require('../model/startModules');

async function saveRepositoryLog(repoLog, issuesResponse, contribsResponse, username, cron = false) {
    const repository = (await Repository.findOrCreate({
        where: {
            owner: repoLog.owner.login,
            name: repoLog.name
        }
    }))[0];
    delete repoLog.id;
    repoLog.githubId = repoLog.id;
    repoLog.stars = repoLog.stargazers_count;
    repoLog.contributors = contribsResponse.length;
    repoLog.cron = cron;
    repoLog.issues = issuesResponse.map(issue => ({
        githubId: issue.id,
        githubCreationDate: issue.created_at,
        labels: issue.labels.map(label => ({
            githubId: label.id,
            name: label.name
        }))
    }));

    repoLog.openIssues = repoLog.open_issues_count;
    repoLog.avgAge = 0;
    repoLog.stdAge = 0;
    if(repoLog.openIssues > 0){
        const openIssuesAge = issuesResponse.map((issue) => (Date.now() - new Date(issue.created_at)));
        repoLog.avgAge = Math.floor(math.mean(openIssuesAge) / 1000 / 86400);
        repoLog.stdAge = Math.floor(math.std(openIssuesAge) / 1000 / 86400);
    }

    const repositoryLog = await RepositoryLog.create(repoLog, {
        include: [{
            association: RepositoryLog.Issues,
            include: [Issue.Labels]
        }]
    });
    await repositoryLog.setRepository(repository);
    if (username) {
        const user = (await User.findOrCreate({
            where: {
                username
            }
        }))[0];
        await repositoryLog.setUser(user);
    }
}

async function getRepositoryInfo(owner, repoName, username = false, cron = false) {
    let response;
    let repoLog;
    let issuesResponse;
    let contribsResponse;
    try {
        console.log('starting getRepositoryInfo');
        response = (await getRepository(owner, repoName));
        if (response.message === "Not Found") {
            throw new Error('Repository not found');
        }
        console.log('got repository');
        repoLog = response;
        issuesResponse = await getAllRepoIssues(owner, repoName);
        console.log('got issues');
        contribsResponse = await getAllContributors(owner, repoName);
        console.log('got contributors');
    } catch (err) {
        if (err.message === "Repository not found") {
            throw err;
        }
        throw new Error('Error getting repository data');
    }

    try {
        await saveRepositoryLog(repoLog, issuesResponse, contribsResponse, username, cron);
    } catch (err) {
        console.error(err);
        throw new Error('Error persisting repository data');
    }

    try {
        return {
            project: repoLog.name,
            owner: repoLog.owner.login,
            openIssues: repoLog.openIssues,
            avgAge: repoLog.avgAge,
            stdAge: repoLog.stdAge
        };
    } catch (err) {
        throw new Error('Error persisting repository data');
    }
}

async function searchRepositoryInfo(query, username) {
    let response;
    let repoLog;
    let issuesResponse;
    let contribsResponse;
    try {
        response = (await searchRepositories(query));
        if (response.total_count === 0) {
            throw new Error('Repository not found');
        }
        repoLog = response.items[0];
        issuesResponse = await getAllRepoIssues(repoLog.owner.login, repoLog.name);
        contribsResponse = await getAllContributors(repoLog.owner.login, repoLog.name);
    } catch (err) {
        if (err.message === "Repository not found") {
            throw err;
        }
        throw new Error('Error getting repository data');
    }
    try {
        await saveRepositoryLog(repoLog, issuesResponse, contribsResponse, username);
    } catch (err) {
        throw new Error('Error persisting repository data');
    }

    try {
        return {
            project: repoLog.name,
            owner: repoLog.owner.login,
            openIssues: repoLog.openIssues,
            avgAge: repoLog.avgAge,
            stdAge: repoLog.stdAge
        };
    } catch (err) {
        throw new Error('Error generating response');
    }
}

async function generateRepositoryStatisticsData() {
    try {
        const users = await User.findAll({
            include: Repository
        });
        const allRepos = [];
        users.forEach((user) => {
            user.repositories.forEach((repository) => {
                if (allRepos.indexOf(repository) < 0) {
                    allRepos.push(repository);
                }
            });
        });
        for(repository of allRepos){
            await getRepositoryInfo(repository.owner, repository.name, false, true)
        }
        return {'success':true};
    } catch (err) {
        console.error(err);
    }
}


module.exports = { getRepositoryInfo, searchRepositoryInfo, generateRepositoryStatisticsData }
const math = require('mathjs');
//Services
const searchRepositories = require('../services/searchRepositories');
const getAllRepoIssues = require('../services/getAllRepoIssues');
const getAllContributors = require('../services/getAllContributors');
//Model
const RepositoryLog = require('../model/repositoryLog');
const Issue = require('../model/issue');
const Repository = require('../model/repository');

async function saveRepositoryLog(repoLog, issuesResponse, contribsResponse, cron){
    try{
        const repository = (await Repository.findOrCreate({
            where:{
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

        repositoryLog = await RepositoryLog.create(repoLog, {
            include: [{
                association: RepositoryLog.Issues,
                include: [Issue.Labels]
            }]
        });
        await repositoryLog.setRepository(repository);
    } catch(err) {
        console.error(err);
    }
}

async function getRepositoryInfo(owner,repoName,cron=false) {
    const query = owner + '/' + repoName;
    const response = (await searchRepositories(query));
    const repoLog = response.items[0];
    const issuesResponse = await getAllRepoIssues(repoLog.issues_url);
    const contribsResponse = await getAllContributors(repoLog.contributors_url);
    saveRepositoryLog(repoLog,issuesResponse,contribsResponse, cron);

    const openIssuesAge = issuesResponse.map((issue) => (Date.now() - new Date(issue.created_at)));
    return {
        project: repoLog.name,
        owner: repoLog.owner.login,
        opnIssues: repoLog.open_issues_count,
        avgAge: Math.floor(math.mean(openIssuesAge) / 1000 / 86400),
        stdAge: Math.floor(math.std(openIssuesAge) / 1000 / 86400)
    };
}

async function searchRepositoryInfo(query) {
    const response = (await searchRepositories(query));
    const repoLog = response.items[0];
    const issuesResponse = await getAllRepoIssues(repoLog.issues_url);
    const contribsResponse = await getAllContributors(repoLog.contributors_url);
    saveRepositoryLog(repoLog,issuesResponse,contribsResponse);

    const openIssuesAge = issuesResponse.map((issue) => (Date.now() - new Date(issue.created_at)));
    return {
        project: repoLog.name,
        owner: repoLog.owner.login,
        opnIssues: repoLog.open_issues_count,
        avgAge: Math.floor(math.mean(openIssuesAge) / 1000 / 86400),
        stdAge: Math.floor(math.std(openIssuesAge) / 1000 / 86400)
    };
}


module.exports = {getRepositoryInfo, searchRepositoryInfo}
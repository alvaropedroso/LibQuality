const math = require('mathjs');
//Services
const searchRepositories = require('../services/searchRepositories');
const getAllRepoIssues = require('../services/getAllRepoIssues');
const getAllContributors = require('../services/getAllContributors');
//Model
const RepositoryLogs = require('../model/repositoryLogs');
const Issue = require('../model/issue');

async function incrementrepoData(repo){
    const issuesResponse = await getAllRepoIssues(repo.issues_url);
    repo.issues = issuesResponse.map(issue => ({
        githubId: issue.id,
        githubCreationDate: issue.created_at,
        labels: issue.labels.map(label => ({
            githubId: label.id,
            name: label.name
        }))
    }));
    const contribsResponse = await getAllContributors(repo.contributors_url);
    repo.contributors = contribsResponse.length;
    return repo;
};

module.exports = async function getRepositoryInfo(query) {
    const response = await searchRepositories(query);
    const repo = await incrementrepoData(response.items[0]);
    repo.githubId = repo.id;
    repo.stars = repo.stargazers_count;
    repositoryLogs = await RepositoryLogs.create(repo, {
        include: [{
            association: RepositoryLogs.Issues,
            include: [Issue.Labels]
        }]
    });

    const openIssuesAge = repo.issues.map((issue) => (Date.now() - new Date(issue.githubCreationDate)));
    return {
        project: repo.name,
        owner: repo.owner.login,
        opnIssues: repo.open_issues_count,
        avgAge: Math.floor(math.mean(openIssuesAge) / 1000 / 86400),
        stdAge: Math.floor(math.std(openIssuesAge) / 1000 / 86400)
    };
}

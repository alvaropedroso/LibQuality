const math = require('mathjs');
//Services
const searchRepositories = require('../services/searchRepositories');
const getAllRepoIssues = require('../services/getAllRepoIssues');
const getAllContributors = require('../services/getAllContributors');
//Model
const Repository = require('../model/repository');
const Issue = require('../model/issue');


module.exports = async function getRepositoryInfo(query) {
    const response = await searchRepositories(query);
    const repo = response.items[0];
    const issuesResponse = await getAllRepoIssues(repo.issues_url);
    const OpenIssuesAge = issuesResponse.map((issue)=>(Date.now()-new Date(issue.created_at)));
    const contribsResponse = await getAllContributors(repo.contributors_url);
    
    repo.issues = issuesResponse;

    repository = await Repository.create({
        githubId: repo.id,
        stars: repo.stargazers_count,
        forks: repo.forks,
        contributors: contribsResponse.length,
        issues: issuesResponse.map(issue => ({
            githubId: issue.id,
            githubCreationDate: issue.created_at,
            labels: issue.labels.map(label =>({
                githubId: label.id,
                name: label.name
            }))
        }))
    },{
        include: [{
            association: Repository.Issues,
            include: [Issue.Labels]
        }]
    });

    return {
      project: repo.name,
      owner: repo.owner.login,
      opnIssues: repo.open_issues_count,
      avgAge: Math.floor(math.mean(OpenIssuesAge)/1000/86400),
      stdAge: Math.floor(math.std(OpenIssuesAge)/1000/86400)
    };
}


const axios = require('axios');

module.exports = async function getAllContributors(owner,repoName) {
    let pageNum = 1;
    let responseLength;
    const allIssues = [];
    do {
        try {
            const URL = `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=100&page=${pageNum}`
            const response = await axios.get(URL);
            allIssues.push(...response.data);
            responseLength = response.data.length;
        } catch (err) {
            console.error(err);
        }
        pageNum++;
    } while (responseLength === 100)
    return allIssues;
}
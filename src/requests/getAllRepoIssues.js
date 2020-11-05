
const axios = require('axios');

module.exports = async function getAllRepoIssues(owner,repoName) {
    let pageNum = 1;
    let responseLength;
    const allIssues = [];
    do{
        try{
            const URL = `https://api.github.com/repos/${owner}/${repoName}/issues?state=open&per_page=100&page=${pageNum}`
            const response = await axios.get(URL);
            allIssues.push(...response.data);
            responseLength = response.data.length;
        } catch(err){
            throw new Error('Error getting repository data');
        }
        pageNum++;
    } while(responseLength === 100)
    return allIssues;
}
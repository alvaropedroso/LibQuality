
const axios = require('axios');

module.exports = async function getAllRepoIssues(issues_url) {
    let pageNum = 1;
    let responseLength;
    const allIssues = [];
    do{
        try{
            const URL = `${issues_url.replace(/{.*}/,'')}?state=open&per_page=100&page=${pageNum}`
            const response = await axios.get(URL);
            allIssues.push(...response.data);
            responseLength = response.data.length;
        } catch(err){
            console.error(err);
        }
        pageNum++;
    } while(responseLength === 100)
    return allIssues;
}
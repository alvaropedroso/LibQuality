
const axios = require('axios');

module.exports = async function getAllContributors(contrib_url) {
    let pageNum = 1;
    let responseLength;
    const allIssues = [];
    do{
        try{
            const URL = `${contrib_url.replace(/{.*}/,'')}?per_page=100&page=${pageNum}`
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
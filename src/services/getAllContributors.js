
const axios = require('axios');


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   

module.exports = async function getAllContributors(issues_url) {
    let pageNum = 100;
    let responseLength;
    const allIssues = [];
    do{
        try{
            const URL = `${issues_url.replace(/{.*}/,'')}?per_page=2&page=${pageNum}`
            const response = await axios.get(URL);
            allIssues.push(...response.data);
            responseLength = response.data.length;
        } catch(err){
            console.error(err);
        }
        pageNum++;
        await sleep(1000)
    } while(responseLength === 100)
    return allIssues;
}
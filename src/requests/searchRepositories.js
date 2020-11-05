
const axios = require('axios');

module.exports = async function searchRepositories(repoName) {
    try{
        const URL = `https://api.github.com/search/repositories?q=${repoName}`;
        const response = await axios.get(URL,{auth:{username: process.env.GITHUB_USER,password: process.env.GITHUB_TOKEN}});
        return response.data;
    } catch(err){
        throw new Error('Error getting repository data');
    }
}
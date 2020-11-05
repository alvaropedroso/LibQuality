
const axios = require('axios');

module.exports = async function searchRepositories(repoName) {
    try{
        const URL = `https://api.github.com/search/repositories?q=${repoName}`;
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        throw new Error('Error getting repository data');
    }
}
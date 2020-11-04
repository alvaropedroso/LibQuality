
const axios = require('axios');

module.exports = async function getRepository(owner,repoName) {
    try{
        const URL = `https://api.github.com/repos/${owner}/${repoName}`;
        const response = await axios.get(URL);
        return response.data;
    } catch(err){
        console.error(err);
    }
}
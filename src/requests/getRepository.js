
const axios = require('axios');

module.exports = async function getRepository(owner,repoName) {
    try{
        const URL = `https://api.github.com/repos/${owner}/${repoName}`;
        const response = await axios.get(URL,{auth:{username: process.env.GITHUB_USER,password: process.env.GITHUB_TOKEN}});
        return response.data;
    } catch(err){
        if(err.response.status === 404){
            throw new Error('Repository not found');
        }
        throw new Error('Error getting repository data');
    }
}
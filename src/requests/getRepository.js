
const axios = require('axios');

module.exports = async function getRepository(owner,repoName) {
    try{
        const URL = `https://api.github.com/repos/${owner}/${repoName}`;
        const response = await axios.get(URL,{auth:{username: process.env.GITHUB_USER,password: process.env.GITHUB_TOKEN}});
        return response.data;
    } catch(err){
        console.error(err);
        throw new Error('Error getting repository data');
    }
}
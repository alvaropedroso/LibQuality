const math = require('mathjs');
//Services
//Model
const User = require('../model/user');
const Repository = require('../model/repository');
const UserRepository = require('../model/userRepository');
const { getRepositoryInfo } = require('./repositoryInfo');
const RepositoryLog = require('../model/repositoryLog');
const Issue = require('../model/issue');


async function saveNewLib(owner, repo, username){
    console.log(owner, repo, username);
    const user = (await User.findOrCreate({where:{
        username
    }}))[0];
    console.log(user);
        const repository = (await Repository.findOrCreate({where:{
            owner:owner,
            name:repo
    }}))[0];
    await user.addRepository(repository)
    return user;
}

async function deleteLib(owner, repo, username){
    const user = await User.findOne({where:{
        username
    }});
    const repository = await Repository.findOne({where:{
        owner:owner,
        name:repo
    }});
    await user.removeRepository(repository);
    return user;
}

async function getLibsInfo(username){
    try{
        const user = await User.findOne({
            where:{
                username:username,
            },
            include: [{
                model: Repository,
                required: false,
                // through:{
                //     where
                // }
                include: {
                    model: RepositoryLog,
                    where:{
                        cron:true
                    },
                    required: false,
                    include: {
                        model: Issue,
                    }
                }
            }]
        });
        return user;
    } catch(err){
        console.error(err)
    }
}

async function generateData(){
    try{
        const users = await User.findAll({
            include: Repository
        });
        const allRepos = [];
        users.forEach((user)=>{
            user.repositories.forEach((repository)=>{
                if(allRepos.indexOf(repository) < 0 ){
                    allRepos.push(repository);
                }
            });
        });
        const response = await Promise.all(allRepos.map(async (repository) => await getRepositoryInfo(repository.owner,repository.name, true)));
        return response;
    } catch(err){
        console.error(err);
    }
}

module.exports = {
    saveNewLib,
    deleteLib,
    getLibsInfo,
    generateData,
};
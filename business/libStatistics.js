const math = require('mathjs');
//Services
//Model
const User = require('../model/user');
const Repository = require('../model/repository');
const UserRepository = require('../model/userRepository');


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
    const user = await User.findOne({where:{
            username,
        },
        include: Repository
    });
    // user.repositories.forEach(()=>{
        
    // });
    return user;
}

module.exports = {
    saveNewLib,
    deleteLib,
    getLibsInfo
};
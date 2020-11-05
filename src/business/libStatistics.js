const math = require('mathjs');
//Model
const {Issue, Repository, RepositoryLog, User} = require('../model/startModules');


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

module.exports = {
    saveNewLib,
    deleteLib,
    getLibsInfo
};
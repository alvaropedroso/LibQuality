const math = require('mathjs');
//Model
const { Issue, Repository, RepositoryLog, User } = require('../model/startModules');


async function saveNewLib(owner, repo, username) {
    const user = (await User.findOrCreate({
        where: {
            username
        }
    }))[0];
    const repository = (await Repository.findOrCreate({
        where: {
            owner: owner,
            name: repo
        }
    }))[0];
    await user.addRepository(repository)
    return user;
}

async function deleteLib(owner, repo, username) {
    const user = await User.findOne({
        where: {
            username
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    const repository = await Repository.findOne({
        where: {
            owner: owner,
            name: repo
        }
    });
    if (!repository) {
        throw new Error('Repository not found');
    }
    try {
        await user.removeRepository(repository);
        return user;
    } catch (err) {
        throw new Error('Error persisting data');
    }
}

async function getLibsInfo(username) {
    const user = await User.findOne({
        where: {
            username: username,
        },
        include: [{
            model: Repository,
            required: false,
            include: {
                model: RepositoryLog,
                where: {
                    cron: true
                },
                required: false
            }
        }]
    });
    if(!user){
        throw new Error("User not found")
    }
    return user;
}

module.exports = {
    saveNewLib,
    deleteLib,
    getLibsInfo
};
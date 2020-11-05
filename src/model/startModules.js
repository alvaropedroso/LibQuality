const Issue = require("./issue");
const Label = require("./label");
const Repository = require("./repository");
const RepositoryLog = require("./repositoryLog");
const User = require("./user");
const UserRepository = require("./userRepository");
const sequelize = require('./sequilize');

Issue.Labels = Issue.hasMany(Label);
Repository.RepositoryLog = Repository.hasMany(RepositoryLog);
Repository.belongsToMany(User, {through: UserRepository});
RepositoryLog.Issues = RepositoryLog.hasMany(Issue);
RepositoryLog.User = RepositoryLog.belongsTo(User);
RepositoryLog.Repository = RepositoryLog.belongsTo(Repository);
User.belongsToMany(Repository, {through: UserRepository});

// (async () => {
//     await sequelize.sync();
// })();

module.exports = {
    Issue,
    Label,
    Repository,
    RepositoryLog,
    User,
    UserRepository,
    async startupDB(){await sequelize.sync();},
}
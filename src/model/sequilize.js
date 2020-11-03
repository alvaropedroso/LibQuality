const { Sequelize } = require('sequelize');
let sequelize;// = new Sequelize('sqlite::memory:');

if (true) {
    sequelize = new Sequelize('LibQualityDB', 'libQuality', 'libQualityPassword', {
        host: 'localhost',
        dialect: 'mysql'
    });
}


(async () => {
    await sequelize.sync();
})();

module.exports = sequelize;
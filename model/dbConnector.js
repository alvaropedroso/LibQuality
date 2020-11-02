const sequelize = require('./sequilize');

module.exports = async function(query){
    const response = await sequelize.query(query);
    console.log(response);
}

Product.create({
    title: 'Chair',
    user: {
      firstName: 'Mick',
      lastName: 'Broadstone',
      addresses: [{
        type: 'home',
        line1: '100 Main St.',
        city: 'Austin',
        state: 'TX',
        zip: '78704'
      }]
    }
  }, {
    include: [{
      association: Product.User,
      include: [ User.Addresses ]
    }]
  })
const Sequelize = require('sequelize');

const dbName = 'pgguide';
const dbUsername = 'keith';
const dbPassword = 'mypassword';
const dbHost = 'localhost';
const dbDialect = 'postgres';

const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
    host: dbHost,
    dialect: dbDialect
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

sequelize.sync({force: false}).then(() => {
  console.log('Successfully synced to DB');
});

const database = {
    sequelize: sequelize,
    Sequelize: Sequelize,
    user: require('./models/userModel.js')(sequelize, Sequelize),
    product: require('./models/productModel.js')(sequelize, Sequelize),
    purchase: require('./models/purchaseModel.js')(sequelize, Sequelize),
    purchaseItem: require('./models/purchaseItemModel.js')(sequelize, Sequelize)
};

module.exports = database;
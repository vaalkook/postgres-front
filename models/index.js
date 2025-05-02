const { Sequelize } = require('sequelize');
const dbConfig = require('../database/config');

const dialect = process.env.DB_DIALECT || 'postgres';
const config = dbConfig[dialect];


const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: config.dialectOptions || {},
        logging: config.logging || false,
        define: config.define || {},
        pool: config.pool || {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Group = require('./Group')(sequelize, Sequelize);
db.Idol = require('./Idol')(sequelize, Sequelize);

db.Group.hasMany(db.Idol, { foreignKey: 'groupId', as: 'members' });
db.Idol.belongsTo(db.Group, { foreignKey: 'groupId', as: 'group' });

module.exports = db;

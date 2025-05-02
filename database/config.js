const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const useSSL = process.env.PG_SSL === 'true';

module.exports = {
    postgres: {
        database: process.env.PG_DATABASE,
        username: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: parseInt(process.env.PG_PORT, 10), // Asegura que sea número
        dialect: 'postgres',
        dialectOptions: useSSL ? {
            ssl: {
                require: true,
                rejectUnauthorized: true,
                ca: fs.readFileSync(process.env.PG_SSL_CA).toString(),
            }
        } : {},
        logging: false,
        define: {
            timestamps: true
        }
    }
};

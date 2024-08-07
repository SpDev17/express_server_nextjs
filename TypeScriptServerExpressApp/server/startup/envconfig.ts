const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    APP_PORT: process.env.APP_PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_URI1: process.env.MONGODB_URI1,
    npm_package_version: process.env.npm_package_version,
    LogToDb: process.env.LogToDb,
    Secrets_session:process.env.Secrets_session
};
const { DataSource } = require("typeorm");
const path = require("path");
const dotenv = require("dotenv").config;

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [path.join(__dirname, "../modules/**/**/*.entity.js")],
    migrations: [path.join(__dirname, "../migrations/*.js")],
});

module.exports = AppDataSource;

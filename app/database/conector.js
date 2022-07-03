module.exports = {
    HOST: process.env['DATABASE_HOST'] || "localhost",
    USER: process.env['DATABASE_USER'] || "postgres",
    PASSWORD: process.env['DATABASE_PASSWORD'] || "12345",
    DB: process.env['DATABASE_NAME'] || "proyecto-rest",
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}
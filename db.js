require('dotenv').config();

const { Pool } = require("pg"); 

const pool = new Pool({

  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,

});

client.connect()
.then(() => console.log("Conectado ao PostgreSQL"))
.catch(error => console.log("Erro na conexão", error))

module.exports = pool;
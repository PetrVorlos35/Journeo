const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // Zvýšení timeoutu pro připojení
};

let db;

function handleDisconnect() {
  db = mysql.createPool(dbConfig);

  db.getConnection((err, connection) => {
    if (err) {
      console.error('Chyba připojení k databázi:', err);
      setTimeout(handleDisconnect, 5000); // Zkusit znovu po 5 sekundách
    } else {
      console.log('Připojeno k databázi.');
      connection.release();
    }
  });

  db.on('error', (err) => {
    console.error('Database error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
      console.error('Spojení ztraceno. Znovu se připojuji...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;

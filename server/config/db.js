import mysql from "mysql2/promise";
import "./env.js";

// Check if Railway provided a full MYSQL_URL or DATABASE_URL
const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

let db;

if (connectionUri) {
  db = mysql.createPool(connectionUri);
} else {
  db = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    user: process.env.MYSQLUSER || process.env.DB_USER || "root",
    password:
      process.env.MYSQLPASSWORD !== undefined
        ? process.env.MYSQLPASSWORD
        : process.env.DB_PASSWORD !== undefined
        ? process.env.DB_PASSWORD
        : "",
    database:
      process.env.MYSQLDATABASE || process.env.DB_NAME || "sanchari",
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

export default db;

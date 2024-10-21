import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// export const dbConnection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

export const dbConnection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true, // Wait if all connections are used
  connectionLimit: 10, // Maximum number of connections
  queueLimit: 0, // Unlimited requests in queue
});

dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error("Error getting connection:", err);
    return;
  }
  console.log("Connected to the database");
  // Use the connection and release it after
  connection.release();
});

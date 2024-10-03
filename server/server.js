// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");

// Initialize Express app
const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Import configuration from JSON file
const { Config } = require("../src/config/config.json");

// Create a connection pool with the required details
var pool = mysql.createPool({
  connectionLimit: Config.CONNECTION_LIMIT,
  host: Config.HOST, // IP address of server running MySQL
  user: Config.USER, // MySQL username
  password: Config.PASSWORD, // MySQL password
  port: Config.PORT, // MySQL port
  database: Config.DATABASE, // MySQL database name
});

// Establish connection to the database
pool.getConnection(function (err) {
  if (err) throw err;
  console.log("Database connection successful");
});

/* 
  HEALTH CHECK ROUTE
  Simple route to check if the server is running
*/
app.get("/", (req, res) => {
  res.send("OK");
});

/*
  ADD USER
  Route to add a new user to the database
  Expects 'id', 'firstName', and 'lastName' as query parameters
*/
app.get("/users/add", (req, res) => {
  const { id, firstName, lastName } = req.query;
  pool.getConnection(function (err, con) {
    con.query(
      `INSERT INTO Users (id, first_name, last_name) VALUES (?, ?, ?)`,
      [id.trim(), firstName, lastName],
      (err, results) => {
        if (err) res.send(err);
        else res.send(`Successfully added ${id} into the Users table`);
      }
    );
    con.release();
  });
});

/*
  REMOVE USER
  Route to remove a user from the database
  Expects 'id' as a query parameter
*/
app.get("/users/remove", (req, res) => {
  const { id } = req.query;
  pool.getConnection(function (err, con) {
    con.query(`SELECT * FROM Users WHERE id = ?`, [id], (err, results) => {
      if (err) res.send(err);
      else if (results.length) {
        con.query(`DELETE FROM Users WHERE id = ?`, [id], (err, results) => {
          if (err) res.send(err);
          else res.send(`Successfully deleted user ${id} from the Users table`);
        });
      } else {
        res.send(`User ${id} not found`);
      }
    });
    con.release();
  });
});

/*
  GET FILES
  Route to retrieve files associated with a user
  Expects 'id' as a query parameter
*/
app.get("/files", (req, res) => {
  pool.getConnection(function (err, con) {
    const { id } = req.query;
    if (!id) return res.json({});
    con.query(`SELECT * FROM Users WHERE id = ?`, [id], (err, results) => {
      if (err) res.send(err);
      else {
        let query = `SELECT * FROM Files WHERE user_id = ?`;
        con.query(query, [id], (err, results) => {
          if (err) res.send(err);
          else {
            return res.json({
              data: results,
            });
          }
        });
      }
    });
    con.release();
  });
});

/*
  ADD FILE
  Route to add a new file to the database
  Expects 'userId', 'fileId', 'title', 'description', and 'size' as query parameters
*/
app.get("/files/add", (req, res) => {
  var currTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  pool.getConnection(function (err, con) {
    const { userId, fileId, title, description, size } = req.query;
    con.query(
      `INSERT INTO Files (user_id, file_id, title, size, description, uploaded_time, updated_time) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, fileId, title, size, description, currTime, currTime],
      (err, results) => {
        if (err) res.send(err);
        else res.send(`Successfully added ${fileId} into the Files table`);
      }
    );
    con.release();
  });
});

/*
  UPDATE FILE
  Route to update an existing file's information
  Expects 'entryId', 'userId', and optional 'fileId', 'title', 'description', 'size' as query parameters
*/
app.get("/files/update", (req, res) => {
  var currTime = new Date().toISOString().slice(0, 19).replace("T", " ");
  const { entryId, userId, fileId, title, description, size } = req.query;
  pool.getConnection(function (err, con) {
    con.query(`SELECT * FROM Users WHERE id = ?`, [userId], (err, results) => {
      if (err) res.send(err);
      else {
        let query = `UPDATE Files SET `;
        let params = [];
        if (fileId) {
          query += `file_id = ?, `;
          params.push(fileId);
        }
        if (title) {
          query += `title = ?, `;
          params.push(title);
        }
        if (size) {
          query += `size = ?, `;
          params.push(size);
        }
        if (description) {
          query += `description = ?, `;
          params.push(description);
        }
        query += `updated_time = ? WHERE entry_id = ?`;
        params.push(currTime, entryId);

        con.query(query, params, (err, results) => {
          if (err) res.send(err);
          else res.send(`Successfully updated entry ${entryId} in the Files table`);
        });
      }
    });
    con.release();
  });
});

/*
  REMOVE FILE
  Route to remove a file from the database
  Expects 'id' and 'userId' as query parameters
*/
app.get("/files/remove", (req, res) => {
  const { id, userId } = req.query;
  pool.getConnection(function (err, con) {
    con.query(`SELECT * FROM Users WHERE id = ?`, [userId], (err, results) => {
      if (err) res.send(err);
      else if (results.length === 1) {
        con.query(`DELETE FROM Files WHERE entry_id = ?`, [id], (err, results) => {
          if (err) res.send(err);
          else res.send(`Successfully deleted entry ${id} from the Files table`);
        });
      } else {
        res.send(`Could not delete ${id}. The file was not found with your account.`);
      }
    });
    con.release();
  });
});

/*
  APP LISTENER
  Starts the server on port 3001
*/
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

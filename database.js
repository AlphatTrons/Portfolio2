const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./comments.db');

// Create the comments table if it doesn't already exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      comment TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;

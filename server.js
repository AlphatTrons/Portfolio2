const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import the database setup
const app = express();

// Middleware to parse JSON data from requests
app.use(bodyParser.json());

// Route to add a new comment
app.post('/add-comment', (req, res) => {
    const { username, comment } = req.body;

    if (!username || !comment) {
        return res.status(400).json({ error: "Username and comment are required" });
    }

    const stmt = db.prepare('INSERT INTO comments (username, comment) VALUES (?, ?)');
    stmt.run(username, comment, function(err) {
        if (err) {
            return res.status(500).json({ error: "Error adding comment" });
        }
        res.status(201).json({ message: "Comment added successfully", id: this.lastID });
    });
});

// Route to get all comments
app.get('/comments', (req, res) => {
    db.all('SELECT * FROM comments ORDER BY timestamp DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error fetching comments" });
        }
        res.json(rows);
    });
});

// Route to delete a comment by ID
app.delete('/delete-comment/:id', (req, res) => {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(id, function(err) {
        if (err) {
            return res.status(500).json({ error: "Error deleting comment" });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }
        res.json({ message: "Comment deleted successfully" });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const pool = require('../config/db');
const fs = require('fs');

// Create a new log entry
exports.createEntry = async (req, res) => {
    try {
        const { userId } = req.user; // student_id
        const { content, date, status } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        const entryDate = date || new Date();
        const entryStatus = status || 'In Progress';

        const result = await pool.query(
            "INSERT INTO logbook_entries (student_id, content, date, status) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, content, entryDate, entryStatus]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error creating log entry:", err);
        try { fs.appendFileSync('debug_logbook.txt', `[${new Date().toISOString()}] ERROR: ${err.message}\n${err.stack}\n`); } catch (e) { }
        res.status(500).json({ error: "Failed to create log entry" });
    }
};

// Update a log entry
exports.updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;
        const { content, status } = req.body;

        const result = await pool.query(
            "UPDATE logbook_entries SET content = $1, status = $2 WHERE id = $3 AND student_id = $4 RETURNING *",
            [content, status, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Log entry not found or unauthorized" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating log entry:", err);
        res.status(500).json({ error: "Failed to update log entry" });
    }
};

// Delete a log entry
exports.deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.user;

        const result = await pool.query(
            "DELETE FROM logbook_entries WHERE id = $1 AND student_id = $2 RETURNING *",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Log entry not found or unauthorized" });
        }

        res.json({ message: "Log entry deleted successfully" });
    } catch (err) {
        console.error("Error deleting log entry:", err);
        res.status(500).json({ error: "Failed to delete log entry" });
    }
};

// Get all entries for the logged-in student
exports.getEntries = async (req, res) => {
    try {
        const { userId } = req.user;

        const result = await pool.query(
            "SELECT * FROM logbook_entries WHERE student_id = $1 ORDER BY date DESC, created_at DESC",
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching log entries:", err);
        res.status(500).json({ error: "Failed to fetch log entries" });
    }
};

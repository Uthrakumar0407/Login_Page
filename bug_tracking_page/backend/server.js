const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'novalnet', // Replace with your MySQL password
    database: 'bug_tracking_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// API Routes
app.get('/api/bugs', (req, res) => {
    db.query('SELECT * FROM bugs', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post('/api/bugs', (req, res) => {
    const { title, description, device, severity, status, file, additionalInfo, comments } = req.body;
    const query = 'INSERT INTO bugs (title, description, device, severity, status, file, additional_info, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, device, severity, status, file, additionalInfo, comments], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

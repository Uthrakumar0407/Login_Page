const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'novalnet',
  database: 'myapp',
});

// Testing DB connection
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Register Route
app.post('/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Error hashing password' });

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error registering user' });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login Route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });

    if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing passwords' });

      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Route to create a new project
app.post('/createProject', (req, res) => {
  const { projectName, createdBy } = req.body;
  const projectId = Date.now().toString(); // Generate a unique project ID
  const createdTime = new Date().toISOString().split('T')[0];

  const query = 'INSERT INTO projects (projectId, projectName, createdBy, createdTime) VALUES (?, ?, ?, ?)';
  db.query(query, [projectId, projectName, createdBy, createdTime], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create project' });
    }
    res.status(200).json({ message: 'Project created successfully' });
  });
});

// Route to fetch all projects
app.get('/projects', (req, res) => {
  const query = 'SELECT * FROM projects';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
    res.status(200).json({ projects: results });
  });
});

// Route to delete a project
app.delete('/projects/:projectId', (req, res) => {
  const projectId = req.params.projectId;
  
  const query = 'DELETE FROM projects WHERE projectId = ?';
  db.query(query, [projectId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete the project' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  });
});

// Route to create a new buglist under a specific project
app.post('/projects/:projectId/createbuglist', (req, res) => {
  const { projectId } = req.params; // Project ID from the URL
  const { bugListName, createdBy } = req.body; // Data from the request body
  const bugListId = Date.now().toString(); // Generate a unique buglist ID
  const createdTime = new Date().toISOString().split('T')[0]; // Creation date

  const query = 'INSERT INTO bugLists (bugListId, bugListName, createdBy, createdTime, projectId) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [bugListId, bugListName, createdBy, createdTime, projectId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create buglist' });
    }
    res.status(200).json({ message: 'Buglist created successfully' });
  });
});

// Route to fetch all buglists for a specific project
app.get('/projects/:projectId/buglists', (req, res) => {
  const { projectId } = req.params;

  const query = 'SELECT * FROM bugLists WHERE projectId = ?';
  db.query(query, [projectId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch buglists' });
    }
    res.status(200).json({ buglists: results });
  });
});


// // Route to delete a project
// app.delete('/buglists/:bugListId', (req, res) => {
//   const bugListId = req.params.bugListId;
  
//   const query = 'DELETE FROM buglists WHERE bugListId = ?';
//   db.query(query, [bugListId], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: 'Failed to delete the bugList' });
//     }
//     res.status(200).json({ message: 'bugList deleted successfully' });
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});




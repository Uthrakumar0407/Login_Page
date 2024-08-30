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
  database: 'myapp'
});
//Testing GIT
db.connect(err => {
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

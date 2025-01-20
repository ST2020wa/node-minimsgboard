const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import the pg module

const app = express();
const port = 3000;
const messages = [];

// Set up PostgreSQL client
const pool = new Pool({
  user: 'postgres', // replace with your PostgreSQL username
  host: 'localhost',
  database: 'miniboard', // your database name
  password: 'postgres', // replace with your PostgreSQL password
  port: 5432,
});

// Enable CORS to allow your Angular app to make requests to this backend
app.use(cors());

// Middleware to parse JSON bodies in POST requests
app.use(express.json());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello this is server.js!' });
});

// Example route to provide a service
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from ST! Welcome to my first FULL-STACK project!' });
});
  
  // Get all messages
  // app.get('/messages', (req, res) => {
  //   res.json(messages);
app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Post a new message (this is where the data will be received)
app.post('/api/messages', async (req, res) => {
  const { name, msg } = req.body;

  if (!name || !msg) {
    return res.status(400).send('Name and message are required');
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (name, msg) VALUES ($1, $2) RETURNING *',
      [name, msg]
    );
    res.status(201).json(result.rows[0]); // Return the newly created message
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
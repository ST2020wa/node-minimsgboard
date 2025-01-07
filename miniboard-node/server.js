const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const messages = [];


// Enable CORS to allow your Angular app to make requests to this backend
app.use(cors());

// Middleware to parse JSON bodies in POST requests
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello this is server.js!' });
});

// Example route to provide a service
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from ST! Welcome to my first FULL-STACK project!' });
});
  
  // Get all messages
app.get('/messages', (req, res) => {
  res.json(messages);
});

// Post a new message (this is where the data will be received)
app.post('/api/messages', (req, res) => {
  if (!req.body) {
    return res.status(400).send('Message content is required');
  }

  // Create a new message object
  const newMessage = {
    id: messages.length + 1,  // Simple incrementing ID
    msg: req.body.msg,
    name: req.body.name,
    created_at: new Date(),
  };

  messages.push(newMessage);  // Store the new message in memory
  res.status(201).json(newMessage);  // Return the newly created message to the client
});


  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
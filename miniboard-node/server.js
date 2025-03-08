const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // Import the pg module

const app = express();
const port = 3000;

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

// Set up PostgreSQL client
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'miniboard',
  password: 'postgres',
  port: 5432,
});

// Enable CORS to allow your Angular app to make requests to this backend
app.use(cors());

// Middleware to parse JSON bodies in POST requests
app.use(express.json());
app.use(bodyParser.json());

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get('/messages', async (req, res)=>{
  try{
    const result = await pool.query('SELECT * FROM msg ORDER BY created_at DESC');
    res.json(result.rows);
}catch(err){
  console.error(err);
  res.status(500).send('Server error');}
})

// Example route to provide a service
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from ST! Welcome to my first FULL-STACK project!' });
});
  

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

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

app.post("/log-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username }, // Payload (data to include in the token)
      "your-secret-key", // Secret key (keep this secure and use environment variables in production)
      { expiresIn: "1h" } // Token expiration time
    );

    // Return the token and user info in the response
    return res.json({ username: user.username, token, message: "Login successful" });
  })(req, res, next);
  
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(passport.initialize());
app.use(passport.session());

// to check if a user is still logged in
app.get("/current-user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ username: req.user.username });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

app.post("/submit-msg", async (req, res, next)=>{
  try {
    await pool.query("INSERT INTO msg (user_id, content) VALUES ($1, $2)",[req.body.username, req.body.msg]);
  }catch(err){
    return next(err);
  }
})

app.post("/sign-up", async(req, res, next)=>{
  const {username, password}=req.body;
  if(!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }
  try{
    const userCheck = await pool.query("SELECT * FROM users WHERE username = $1",[username]);
    if(userCheck.rows.length){
      return res.status(400).json({message: "Username already exists"});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );
    const newUser = result.rows[0].username;
    res.status(201).json({username: newUser, message: "Sign-up successful"});
  }catch(err){
    console.error("Sign-up error:", err);
    res.status(500).json({ message: "Server error during sign-up" });
  }
})

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
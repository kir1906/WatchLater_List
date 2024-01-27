const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'watchlater',
  password: '14112009',
  port: 5432,
});
const jwtSecret = 'KIR$14112009';
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const existingUser = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Username is already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query('INSERT INTO users(username, password) VALUES($1, $2) RETURNING id', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.rows[0].id, username: user.rows[0].username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
function authenticateUser(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing token' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error verifying JWT:', error);
    res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
}

app.post('/watchlist', authenticateUser, async (req, res) => {
  try {
    const { title, streamingService, genre, link, source } = req.body;
    const userId = req.user.userId;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const result = await pool.query('INSERT INTO watchlist_items(title, streaming_service, genre, link, source, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *', [title, streamingService, genre, link, source, userId]);

    res.status(201).json({ message: 'Watchlist item added successfully', item: result.rows[0] });
  } catch (error) {
    console.error('Error adding watchlist item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/watchlist/:itemId', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.userId;
    const itemId = req.params.itemId;

    const result = await pool.query('DELETE FROM watchlist_items WHERE id = $1 AND user_id = $2 RETURNING *', [itemId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item not found or unauthorized' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting watchlist item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get('/watchlist', authenticateUser,async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query('SELECT * FROM watchlist_items WHERE user_id = $1', [userId]);
    res.json({ watchlist: result.rows });
  } catch (error) {
    console.error('Error getting watchlist items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

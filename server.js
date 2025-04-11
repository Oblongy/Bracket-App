require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { generateDoubleElimBracket } = require('./bracketLogic');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public', { maxAge: '1d' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// In-memory storage
const brackets = new Map();

// Routes
app.post('/create', (req, res) => {
  const { players } = req.body;
  if (!Array.isArray(players) || players.some(p => typeof p !== 'string')) {
    return res.status(400).json({ error: 'Invalid players array' });
  }
  const id = uuidv4().slice(0, 6);
  const bracket = generateDoubleElimBracket(players);
  brackets.set(id, bracket);
  res.json({ id });
});

app.get('/api/bracket/:id', (req, res) => {
  const bracket = brackets.get(req.params.id);
  if (!bracket) return res.status(404).json({ error: 'Bracket not found' });
  res.json(bracket);
});

app.get('/bracket/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bracket.html'));
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit();
});

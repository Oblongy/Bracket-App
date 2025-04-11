const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const brackets = new Map(); // In-memory storage
const { generateDoubleElimBracket } = require('./bracketLogic');

// Create a new bracket
app.post('/create', (req, res) => {
  const { players } = req.body;
  const id = uuidv4().slice(0, 6);
  const bracket = generateDoubleElimBracket(players);
  brackets.set(id, bracket);
  res.json({ id });
});

// Get a bracket
app.get('/api/bracket/:id', (req, res) => {
  const bracket = brackets.get(req.params.id);
  if (!bracket) return res.status(404).json({ error: 'Bracket not found' });
  res.json(bracket);
});

app.get('/bracket/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'bracket.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;
const DATA_PATH = path.join(__dirname, 'src', 'assets', 'inventory-sample.json');

app.use(cors());
app.use(express.json());

// Get all inventory items
app.get('/api/inventory', (req, res) => {
  fs.readFile(DATA_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read inventory.' });
    res.json(JSON.parse(data));
  });
});

// Update all inventory items
app.put('/api/inventory', (req, res) => {
  fs.writeFile(DATA_PATH, JSON.stringify(req.body, null, 2), 'utf8', (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update inventory.' });
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Inventory API server running at http://localhost:${PORT}`);
});



const express = require('express');
const path = require('path');
const { handleUserRequest } = require('./mcpHost');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// MCP Host: receive user requests and process them
app.get('/tasks', async (req, res) => {
  try {
    const result = await handleUserRequest({ action: 'listTasks' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to handle user questions via query parameter
app.get('/ask', async (req, res) => {
  try {
    const question = req.query.q || '';
    const result = await handleUserRequest({ question });
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`MCP demo app listening at http://localhost:${port}`);
});

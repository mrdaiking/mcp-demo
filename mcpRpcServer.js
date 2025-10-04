// mcpRpcServer.js
// MCP JSON-RPC Server to handle requests from MCP Client
const express = require('express');
const bodyParser = require('body-parser');
const { getTasks } = require('./notion');

const app = express();
app.use(express.json());

app.post('/rpc', async (req, res) => {
  const { jsonrpc, method, params, id } = req.body;
  if (jsonrpc !== '2.0') {
    return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid JSON-RPC version' } });
  }
  if (method === 'getTasks') {
    try {
      const tasks = await getTasks();
      return res.json({
        jsonrpc: '2.0',
        result: tasks,
        id
      });
    } catch (error) {
      return res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message } });
    }
  }
  return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: 'Method not found' } });
});

const port = process.env.RPC_PORT || 4000;
app.listen(port, () => {
  console.log(`MCP JSON-RPC Server listening at http://localhost:${port}/rpc`);
});

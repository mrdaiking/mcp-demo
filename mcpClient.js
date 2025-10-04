// mcpClient.js
// Sends JSON-RPC requests to the MCP Server
const fetch = require('node-fetch');

async function sendContext(context) {
  if (context.tool === 'getTasks') {
    const rpcReq = {
      jsonrpc: '2.0',
      method: 'getTasks',
      params: {},
      id: Date.now()
    };
    try {
      const res = await fetch('http://localhost:4000/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rpcReq)
      });
      const rpcRes = await res.json();
      if (rpcRes.result) {
        return { success: true, data: rpcRes.result };
      } else {
        return { success: false, error: rpcRes.error?.message || 'Unknown error' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
  return { success: false, error: 'Unknown tool' };
}

module.exports = { sendContext };
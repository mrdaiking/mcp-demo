// mcpServer.js
// Query Notion API, log request/response

const { listPages } = require('./notion');

async function listPagesWithLog() {
  console.log('🗄️ MCP Server ->> 📒 Notion API: Query database');
  const result = await listPages();
  console.log('🗄️ MCP Server <<-- 📒 Notion API: Response JSON page list');
  return result;
}

module.exports = {
  listPages: listPagesWithLog
};

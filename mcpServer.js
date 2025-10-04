// mcpServer.js
// Query Notion API, log request/response

const { getTasks } = require('./notion');

async function getTasksWithLog() {
  console.log('🗄️ MCP Server ->> 📒 Notion API: Query database');
  const result = await getTasks();
  console.log('🗄️ MCP Server <<-- 📒 Notion API: Response JSON page list');
  return result;
}

module.exports = {
  getTasks: getTasksWithLog
};

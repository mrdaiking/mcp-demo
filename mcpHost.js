// mcpHost.js
// Receive user requests, determine needed tool, send context to MCP Client
const mcpClient = require('./mcpClient');


async function handleUserRequest(userInput) {
  console.log('👤 User ->> 🤖 MCP Host: ', userInput.question || userInput.action);
  // Determine tool based on user question or action
  let context;
  if (userInput.action === 'listTasks' || (userInput.question && userInput.question.toLowerCase().includes('task'))) {
    context = { tool: 'listPages' };
  } else {
    return { success: false, error: 'Unknown action' };
  }
  console.log('🤖 MCP Host ->> 🔗 MCP Client: Send context', context);
  const result = await mcpClient.sendContext(context);
  console.log('🤖 MCP Host <<-- 🔗 MCP Client: Response context', result);
  // Generate response for user
  return result;
}

module.exports = { handleUserRequest };
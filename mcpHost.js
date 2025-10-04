
// mcpHost.js
// Handles user requests, determines the tool, sends context to MCP Client, and generates natural language answers using OpenAI

const mcpClient = require('./mcpClient');
const { gptNaturalAnswer } = require('./gpt');

async function handleUserRequest(userInput) {
  // Determine which tool to use based on the user question or action
  let context;
  if (
    userInput.action === 'listTasks' ||
    (userInput.question && userInput.question.toLowerCase().includes('task'))
  ) {
    context = { tool: 'getTasks' };
  } else {
    return { success: false, error: 'Unknown action' };
  }

  // Call MCP Client to get data from the server
  const result = await mcpClient.sendContext(context);

  // If tasks are returned, use OpenAI to generate a natural language answer
  if (result.success && Array.isArray(result.data) && result.data.length > 0) {
    try {
      const natural = await gptNaturalAnswer(
        result.data.map(task => ({
          title: task.properties?.['Task name']?.title?.[0]?.plain_text || '',
          status: task.properties?.['Status']?.status?.name || '',
          done: (task.properties?.['Status']?.status?.name || '').toLowerCase() === 'done'
        })),
        userInput.question || ''
      );
      return { ...result, natural };
    } catch (e) {
      return { ...result, natural: 'Cannot generate answer: ' + e.message };
    }
  }
  return result;
}

module.exports = { handleUserRequest };

module.exports = { handleUserRequest };
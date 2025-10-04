require('dotenv').config();
const fetch = require('node-fetch');

// Save chat history per session
const chatHistory = {};

async function gptNaturalAnswer(taskList, userQuestion, sessionId = 'default') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY in .env');

  // Initialize chat history if not exists

  if (!chatHistory[sessionId]) {
    chatHistory[sessionId] = [
      { role: 'system', content: 'You are an AI assistant that helps explain Notion task data in natural, concise English.' }
    ];
  }

  // Add new prompt to history
  const prompt = `Here is a list of tasks from Notion:
${JSON.stringify(taskList, null, 2)}

Please answer the user question in natural, concise, easy-to-understand English based on the above data.
Question: ${userQuestion}`;
  chatHistory[sessionId].push({ role: 'user', content: prompt });

  // Send entire history to OpenAI
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: chatHistory[sessionId],
      max_tokens: 200
    })
  });
  if (!response.ok) throw new Error('OpenAI API error: ' + response.statusText);
  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content?.trim() || '';

  // Save answer to history
  chatHistory[sessionId].push({ role: 'assistant', content: answer });

  // Limit chat history (e.g., keep latest 10 turns)
  if (chatHistory[sessionId].length > 20) {
    chatHistory[sessionId] = [chatHistory[sessionId][0], ...chatHistory[sessionId].slice(-19)];
  }

  return answer;
}

// Reset chat history for a session
function resetChatHistory(sessionId = 'default') {
  delete chatHistory[sessionId];
}

module.exports = { gptNaturalAnswer, resetChatHistory };
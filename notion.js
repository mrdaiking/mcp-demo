require('dotenv').config();
const fetch = require('node-fetch');

// Query Notion API for tasks from a data source
async function getTasks() {
  const dataSourceId = process.env.NOTION_DATABASE_ID;
  const response = await fetch(`https://api.notion.com/v1/data_sources/${dataSourceId}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2025-09-03'
    },
    body: JSON.stringify({ page_size: 10 })
  });
  if (!response.ok) {
    throw new Error(`Error fetching tasks: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results;
}

module.exports = { getTasks };
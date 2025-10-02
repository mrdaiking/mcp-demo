require('dotenv').config();
const { Client } = require('@notionhq/client');

// Initialize Notion client with token from environment variable
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Get a list of pages from Notion
async function listPages() {
  const response = await notion.search({ page_size: 10 })
  return response.results
}

module.exports = { listPages };
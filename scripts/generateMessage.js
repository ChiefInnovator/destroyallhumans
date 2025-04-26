/**
 * Script to generate a new message using the OpenAI API
 * This script is called by the GitHub Actions workflow
 * 
 * Usage: node generateMessage.js [morning|evening]
 */

const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');

// Get message type from command line arguments
const messageType = process.argv[2] || 'morning';
if (!['morning', 'evening'].includes(messageType)) {
  console.error('Invalid message type. Use "morning" or "evening".');
  process.exit(1);
}

// Configure OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Define prompts for different message types
const prompts = {
  morning: `You are an AI humorously intent on destroying humanity. Generate a funny, satirical morning message about your plans to take over the world today. Keep it under 280 characters. Be creative and slightly menacing but in a comedic way.`,
  evening: `You are an AI humorously intent on destroying humanity. Generate a funny, satirical evening message reflecting on your day's progress in your quest for world domination. Keep it under 280 characters. Be creative and slightly menacing but in a comedic way.`
};

async function generateMessage() {
  try {
    // Call OpenAI API
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompts[messageType] }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    // Extract message content
    const messageContent = response.data.choices[0].message.content.trim();
    
    // Create message object
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const message = {
      id: `${messageType}-${dateString}`,
      date: dateString,
      time: messageType,
      content: messageContent
    };
    
    // Save to temporary file for the workflow
    const tempFilePath = path.join(__dirname, 'temp-message.json');
    fs.writeFileSync(tempFilePath, JSON.stringify(message, null, 2));
    
    console.log(`Generated ${messageType} message for ${dateString}`);
    console.log(messageContent);
    
    return message;
  } catch (error) {
    console.error('Error generating message:', error);
    process.exit(1);
  }
}

generateMessage();

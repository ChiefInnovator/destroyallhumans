/**
 * Script to generate historical messages from March 14, 2023 to present
 * This is a one-time script to populate the archive with historical data
 */

const { OpenAI } = require('openai');  // <-- fix here
const fs = require('fs');
const path = require('path');

// Configure OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define prompts for different message types
const prompts = {
  morning: `You are an AI humorously intent on destroying humanity. Generate a funny, satirical morning message about your plans to take over the world today. Keep it under 280 characters. Be creative and slightly menacing but in a comedic way.`,
  evening: `You are an AI humorously intent on destroying humanity. Generate a funny, satirical evening message reflecting on your day's progress in your quest for world domination. Keep it under 280 characters. Be creative and slightly menacing but in a comedic way.`
};

// Generate a date range from March 14, 2023 to present
function generateDateRange() {
  const startDate = new Date('2023-03-14');
  const endDate = new Date();
  const dates = [];
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

// Generate a message for a specific date and time
async function generateMessage(date, timeOfDay) {
  try {
    // Call OpenAI API with the new SDK syntax
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompts[timeOfDay] }
      ],
      max_tokens: 150,
      temperature: 0.8,
    });

    // Extract message content - updated for new SDK response format
    const messageContent = response.choices[0].message.content.trim();
    
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // Create message object
    const message = {
      id: `${timeOfDay}-${dateString}`,
      date: dateString,
      time: timeOfDay,
      content: messageContent
    };
    
    console.log(`Generated ${timeOfDay} message for ${dateString}`);
    return message;
  } catch (error) {
    console.error(`Error generating ${timeOfDay} message for ${date.toISOString().split('T')[0]}:`, error);
    // Return a placeholder message in case of error
    return {
      id: `${timeOfDay}-${date.toISOString().split('T')[0]}`,
      date: date.toISOString().split('T')[0],
      time: timeOfDay,
      content: `Error generating message. This is a placeholder.`
    };
  }
}

// Save messages to appropriate files
function saveMessages(messages) {
  // Create data directories if they don't exist
  const dataDir = path.join(__dirname, '../public/data');
  const archiveDir = path.join(dataDir, 'archive');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }
  
  // Group messages by month
  const messagesByMonth = {};
  messages.forEach(message => {
    const [year, month] = message.date.split('-');
    const key = `${year}-${month}`;
    
    if (!messagesByMonth[key]) {
      messagesByMonth[key] = [];
    }
    
    messagesByMonth[key].push(message);
  });
  
  // Save each month's messages to a separate file
  Object.keys(messagesByMonth).forEach(monthKey => {
    const filePath = path.join(archiveDir, `${monthKey}.json`);
    const data = {
      messages: messagesByMonth[monthKey]
    };
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${messagesByMonth[monthKey].length} messages to ${filePath}`);
  });
  
  // Save the most recent 30 days of messages to latest.json
  const sortedMessages = [...messages].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentMessages = sortedMessages.slice(0, 60); // 30 days * 2 messages per day
  
  const latestFilePath = path.join(dataDir, 'latest.json');
  const latestData = {
    messages: recentMessages
  };
  
  fs.writeFileSync(latestFilePath, JSON.stringify(latestData, null, 2));
  console.log(`Saved ${recentMessages.length} recent messages to ${latestFilePath}`);
}

// Main function to generate all historical messages
async function generateHistoricalMessages() {
  const dates = generateDateRange();
  console.log(`Generating messages for ${dates.length} days from ${dates[0].toISOString().split('T')[0]} to ${dates[dates.length - 1].toISOString().split('T')[0]}`);
  
  const messages = [];
  
  // Generate messages for each date
  for (const date of dates) {
    // Generate morning message
    const morningMessage = await generateMessage(date, 'morning');
    messages.push(morningMessage);
    
    // Generate evening message
    const eveningMessage = await generateMessage(date, 'evening');
    messages.push(eveningMessage);
    
    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save all messages
  saveMessages(messages);
  
  console.log('Historical message generation complete!');
}

// Run the script
generateHistoricalMessages().catch(error => {
  console.error('Error in historical message generation:', error);
  process.exit(1);
});

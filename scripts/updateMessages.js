/**
 * Script to update the JSON data files with new messages
 * This script is called by the GitHub Actions workflow after generating a new message
 */

const fs = require('fs');
const path = require('path');

// Paths
const tempMessagePath = path.join(__dirname, 'temp-message.json');
const latestJsonPath = path.join(__dirname, '../public/data/latest.json');
const archiveDir = path.join(__dirname, '../public/data/archive');

// Ensure directories exist
if (!fs.existsSync(archiveDir)) {
  fs.mkdirSync(archiveDir, { recursive: true });
}

// Load the newly generated message
let newMessage;
try {
  const messageData = fs.readFileSync(tempMessagePath, 'utf8');
  newMessage = JSON.parse(messageData);
} catch (error) {
  console.error('Error reading temporary message file:', error);
  process.exit(1);
}

// Update latest.json (last 30 days of messages)
let latestMessages = { messages: [] };
if (fs.existsSync(latestJsonPath)) {
  try {
    const latestData = fs.readFileSync(latestJsonPath, 'utf8');
    latestMessages = JSON.parse(latestData);
  } catch (error) {
    console.error('Error reading latest.json, creating new file:', error);
  }
}

// Add new message to the array
latestMessages.messages.unshift(newMessage);

// Keep only the last 30 days (60 messages - morning and evening for each day)
latestMessages.messages = latestMessages.messages.slice(0, 60);

// Write updated latest.json
fs.writeFileSync(latestJsonPath, JSON.stringify(latestMessages, null, 2));
console.log('Updated latest.json with new message');

// Update monthly archive
const date = new Date(newMessage.date);
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const archiveFilePath = path.join(archiveDir, `${year}-${month}.json`);

let archiveMessages = { messages: [] };
if (fs.existsSync(archiveFilePath)) {
  try {
    const archiveData = fs.readFileSync(archiveFilePath, 'utf8');
    archiveMessages = JSON.parse(archiveData);
  } catch (error) {
    console.error(`Error reading archive file ${year}-${month}.json, creating new file:`, error);
  }
}

// Check if message already exists in archive (avoid duplicates)
const messageExists = archiveMessages.messages.some(
  msg => msg.id === newMessage.id
);

if (!messageExists) {
  // Add new message to archive
  archiveMessages.messages.push(newMessage);
  
  // Sort messages by date (newest first)
  archiveMessages.messages.sort((a, b) => {
    // First by date
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;
    
    // Then by time (morning before evening)
    return a.time === 'morning' ? -1 : 1;
  });
  
  // Write updated archive file
  fs.writeFileSync(archiveFilePath, JSON.stringify(archiveMessages, null, 2));
  console.log(`Updated archive file ${year}-${month}.json with new message`);
} else {
  console.log(`Message already exists in archive ${year}-${month}.json, skipping`);
}

// Clean up temporary file
try {
  fs.unlinkSync(tempMessagePath);
} catch (error) {
  console.error('Error removing temporary message file:', error);
}

console.log('Message update completed successfully');

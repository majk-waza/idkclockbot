require('dotenv').config();

console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? '✅ Found' : '❌ Missing');
console.log('CLIENT_ID:', process.env.CLIENT_ID ? '✅ Found' : '❌ Missing');
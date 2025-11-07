// registerCommands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error('DISCORD_TOKEN or CLIENT_ID missing in .env');
  process.exit(1);
}

const commands = [
  {
    name: 'clock',
    description: 'Show current time in USA and Poland (and start auto-updates when used in DM).'
  }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Registering global commands (may take up to 1 hour to propagate)...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Global commands registered');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();

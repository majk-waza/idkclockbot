// cleanupCommands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = '1435937180731314218'; // your server ID

if (!TOKEN || !CLIENT_ID) {
  console.error('DISCORD_TOKEN or CLIENT_ID missing in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Fetching global commands...');
    const globalCmds = await rest.get(Routes.applicationCommands(CLIENT_ID));
    console.log(`Global commands found: ${globalCmds.length}`);
    for (const c of globalCmds) {
      console.log(` - [global] ${c.name} (id: ${c.id})`);
      if (c.name === 'clock') {
        console.log(`Deleting global command 'clock' (id ${c.id})`);
        await rest.delete(Routes.applicationCommand(CLIENT_ID, c.id));
        console.log('Deleted global /clock');
      }
    }

    console.log('Fetching guild commands...');
    const guildCmds = await rest.get(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID));
    console.log(`Guild commands found: ${guildCmds.length}`);
    for (const c of guildCmds) {
      console.log(` - [guild] ${c.name} (id: ${c.id})`);
    }

    console.log('Done. If a global /clock existed it has been removed. The guild command remains.');
  } catch (err) {
    console.error('Error while cleaning commands:', err);
  }
})();

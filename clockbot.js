require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, Events } = require('discord.js');

// ---- CONFIG ----
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
  partials: ['CHANNEL'],
});

const USER_1_ID = '1238605238596796448'; // you
const USER_2_ID = '1020156747861729311'; // your friend

let clockInterval = null;
let lastMessages = {};

// ---- FUNCTIONS ----
function getTimes() {
  const now = new Date();
  const optionsUS = { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  const optionsPL = { timeZone: 'Europe/Warsaw', hour: '2-digit', minute: '2-digit', second: '2-digit' };

  const usTime = now.toLocaleTimeString('en-US', optionsUS);
  const plTime = now.toLocaleTimeString('en-US', optionsPL);

  return { usTime, plTime };
}

async function sendOrUpdateClock() {
  const { usTime, plTime } = getTimes();

  // use your custom emojis by ID
  const emoji1 = '<a:1_:1436084226490630174>';
  const emoji2 = '<a:2_:1436084289946124290>';

  const embed = new EmbedBuilder()
    .setTitle(`${emoji1}  🕒 Live Clock  ${emoji2}`)
    .setDescription(`🇺🇸 America : **${usTime}**\n🇵🇱 Poland : **${plTime}**`)
    .setColor(0x00AEFF)
    .setTimestamp();

  for (const [userId, message] of Object.entries(lastMessages)) {
    try {
      await message.edit({ embeds: [embed] });
    } catch (err) {
      console.error(`Failed to update message for ${userId}:`, err.message);
    }
  }
}


// ---- COMMAND HANDLER ----
client.once(Events.ClientReady, (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'clock') return;

  await interaction.reply({ content: '⏳ Starting live clock for you and your friend...', ephemeral: true });

  const user1 = await client.users.fetch(USER_1_ID);
  const user2 = await client.users.fetch(USER_2_ID);

  const embed = new EmbedBuilder()
    .setTitle('🕒 Live Clock')
    .setDescription('Starting...')
    .setColor(0x00AEFF);

  // Send or replace previous messages
  for (const [id, user] of [
    [USER_1_ID, user1],
    [USER_2_ID, user2],
  ]) {
    try {
      const dm = await user.createDM();
      const msg = await dm.send({ embeds: [embed] });
      lastMessages[id] = msg;
    } catch (err) {
      console.error(`Failed to DM ${id}:`, err.message);
    }
  }

  // Stop any previous interval
  if (clockInterval) clearInterval(clockInterval);
  clockInterval = setInterval(sendOrUpdateClock, 5000);
  await sendOrUpdateClock();
});

// ---- LOGIN ----
client.login(process.env.DISCORD_TOKEN).catch((err) => {
  console.error('❌ Login failed:', err.message);
});

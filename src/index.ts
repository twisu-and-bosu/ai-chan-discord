const discord = require('discord.js');
const client = new discord.Client();

const fs = require('fs');

const prefix = '!';
const adminID = '230249439481167872';

client.commands = new discord.Collection();

// ANCHOR: Read commandFiles
fs.readdir('./src/commands/', (err, commands) => {
  if (err) throw err;
  
  commands.forEach(command => {
    const commandFile = require(`./commands/${command}`),
    commandName = command.replace('.ts', '');

    client.commands.set(commandName, commandFile);
  });
});

// ANCHOR: Bot Mount Event Trigger
client.on('ready', () => {
  console.log('Bot is ready.');
});

// ANCHOR: Bot Join Event Trigger
client.on('guildMemberAdd', member => {
  member.send('Welcome to the server!');
});

// ANCHOR: Bot Message Event Trigger
client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args, adminID);
  }
  catch (error) {
    console.error(error);
    message.reply('There was an error trying to execute that command!');
  }
});

// ANCHOR: Discord Login
client.login(process.env.BOT_TOKEN);

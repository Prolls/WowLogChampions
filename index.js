const Discord = require('discord.js')
const Ping = require('./commands/ping')
const Palmares= require('./commands/palmares')
const Logs = require('./logs')
require('dotenv').config();


const bot = new Discord.Client({
	intents: [
		 Discord.GatewayIntentBits.Guilds,
		 Discord.GatewayIntentBits.GuildMessages,
		 Discord.GatewayIntentBits.MessageContent,
		 Discord.GatewayIntentBits.GuildMembers,
     Discord.GatewayIntentBits.DirectMessages
	],
});

bot.on('ready', function () {
  console.log("Je suis connecté !")
  // bot.user.setAvatar('./avatar.png')
  //   .then(() => console.log('Avatar OK'))
  //   .catch(console.error)
    // bot.user.setActivity('Prépare les prochains logs').catch(console.error)

   
})

bot.on('messageCreate', function(message) {
  // Ping.parse(message);
  var palmares = new Palmares();
  palmares.parse(message);
})

bot.login(process.env['TOKEN_DISCORD'])
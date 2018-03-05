let commando = require('discord.js-commando');
let bot = new commando.Client();

bot.registry.registerGroup('chat-commands','Chat-commands');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname+"/commands");

bot.on('message', (msg)=>
{
	if (msg.content.includes('pudding') && msg.author.id!=414809793606320128) 
	{
		msg.channel.sendMessage('Pudding? Where? Gimme that pudding! **I WANT PUDDING**');
	}
});

bot.login('you thought i was giving you the token of my bot?');
console.log('bot is now running');
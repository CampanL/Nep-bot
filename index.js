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

bot.login('NDE0ODA5NzkzNjA2MzIwMTI4.DX6w5A.Gs0XXnM5Su6vP9qV4MPhnTV2Z_Y');
console.log('bot is now running');
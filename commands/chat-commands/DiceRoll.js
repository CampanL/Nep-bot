let commando = require('discord.js-commando');
class DiceRollCommand extends commando.Command
{
	constructor(client)
	{
		super(client, {
			name:'roll',
			group:'chat-commands',
			memberName:'roll',
			description:'Roll a dice'
		});
	};
	async run(message, args)
	{
		let roll = Math.floor(Math.random()*args)+1;
		let comment = "";
		if (isNaN(args)) 
		{
			if (roll ==1) 
			{
				comment = " bad luck friend, maybe next time." 
			}else if (roll==args) 
			{
				comment = " nice roll dude."
			}else
			{
				comment = "."
			}
			message.channel.sendMessage('you rolled a '+roll+comment);
		}else
		{
			message.channel.sendMessage('please put a number of faces for your dice')
		}
	}
}

module.exports = DiceRollCommand;
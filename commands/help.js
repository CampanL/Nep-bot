const Discord = require('discord.js')

exports.help = (chan, bot, prefix)=>
{
	//configuring the command list in an embed element
	let help = new Discord.RichEmbed()
		.setTitle("COMMAND LIST")
		.setAuthor(bot.user.username, bot.user.displayAvatarURL)
		.setColor(15049203)
		.setDescription("Here's the list of all the commands aviable for Nep-bot, prefix is '"+prefix+"' <required argument> [optional argument] **keep in mind that i'm being hosted by my creator for the moment**")
		.setThumbnail("https://cdn.discordapp.com/attachments/414819735688052737/421317305281150976/Nep-help.png",true)
		.addBlankField(true)//public commands
		.addField('avatar <User tag>', 'shows the profile picture of a user')
		.addField('roll [Number of faces] [number of dices]',"Roll the dice(s), maximum 10 dices and 999 faces, default rolls a dice with 6 faces")
		.addField('janken <Pick> [bet]', 'play a round of rock paper scissors')
		.addField('leaderboard', "shows the top 5 users with the highest amount of :moneybag:")
		.addBlankField(true)//moderation commands
		.addField('BANWORD',"here are the commands related to the banword list")
		.addField('banWord add <word to add>','<ROLE WITH ADMINISTRATOR ENABLE REQUIRED> add a word to the banword list')
		.addField('banWord show','display the banword list in chat')
		.addField('banWord remove <word to remove>','<ROLE WITH ADMINISTRATOR ENABLE REQUIRED> remove a word from the banword list')
		.addBlankField(true)
		.addField('REPORT',"here are the commands related to the report list")
		.addField('report user <user tag>','report a user')
		.addField('report list', "<ROLE WITH ADMINISTRATOR ENABLE REQUIRED> send report list in DM")
		.setFooter("© Toraito#8558", bot.user.displayAvatarURL)
		.setTimestamp()

		chan.send(help);//send the embed element in the channel where the command has been entered
}
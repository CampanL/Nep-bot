const Discord = require('discord.js');
const fs = require('fs')

exports.leaderboard = (chan, msg)=>
{
	let leaderboard = [["No one first yet"],["No one second yet"],["No one third yet"],["No one fourth yet"],["No one fifth yet"]];//setting up the leaderboard

	fs.readFile("./storage/"+msg.guild.id+"/money.json", (err,data)=>{
		if (err) throw err
		let bank = JSON.parse(data);//returning the JSON file that contains the amount of money of all users
			bank=bank.users.sort(function(a, b){return b.money - a.money})//sorts the users from the highest amount of money to the lowest
		let actual = 0
		let index = -1
		for (var i = 0; i < bank.length; i++) {
			let money = bank[i].money
			if (actual!=money)//if no one else has the same amount of money					  
			{				  //in the actual index of the leaderboard go to the next index
				actual=money
				index+=1
				if (index>4) break;
				leaderboard[index]=money+"-> "+bank[i].user.username
			}else{leaderboard[index]+=", "+bank[i].user.username}
		}

		//configuring the embed that will contain the leaderboard
		let embedLeaderboard = new Discord.RichEmbed()
		.setTitle("LEADERBOARD")
		.setColor(15049203)
		.setDescription("Here's the leaderboard of who has the highest amount of :moneybag:")
		.setThumbnail("https://cdn.discordapp.com/attachments/414819735688052737/429198715698544643/woah.png")
		.addField("1st:first_place::",leaderboard[0])
		.addField("2nd:second_place::",leaderboard[1])
		.addField("3rd:third_place::",leaderboard[2])
		.addField("4th:",leaderboard[3])
		.addField("5th:",leaderboard[4])
		chan.send(embedLeaderboard)
	})
}
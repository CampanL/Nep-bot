const utils = require('./utils.js')
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

let command_todo=["janken"];
const Angry = ["Now hold on there friend, you're not allowed to say that in here understood?","Say that one more time and i'll nep you up.","Hey don't say something like that in here, are you crazy?","What did you just try to say? That's what i thought, you ain't saying anything	","Please don't use such words in here that's disrespectfull"]
let banAllow = true
bot.on('message', (msg)=>
{
	//administrator verification
	let hasSpecificRight = false;
	msg.member.roles.forEach(role => 
	{
		if(role.hasPermission("ADMINISTRATOR") == true)
		{
			hasSpecificRight = true;
		}
	})

	//command shortcut
	let message = msg.content.toLowerCase();//represents the message's content in lower case
	let chan = msg.channel;//represents the channel where to command got sent
	let serv = msg.guild.name;//return the name of the guild/server
	let Author = msg.author;//represents the author of the message containing the command
	let prefix = "_";//represents the prefix that needs to be used to enter a command
	let args = msg.content.toLowerCase().trim().split(/ +/g);//put the message's content into an array where each words represents an argument
 	let command = args.shift().toLowerCase();//set the first argument as the command

	//allowing the bot to ban words again
	if (message.includes("The word you mentionned is now on the banned_words list")) 
	{
		banAllow=true;	
	}

	
	if (Author.bot)return;//make the bot ignoring itself

	if (message.includes('pudding'))//fun little RP feature
	{
		chan.send('Pudding? Where? Gimme that pudding! **I WANT PUDDING**');
	}

	if (command==prefix+"avatar")//command to display a user's avatar 
	{
		let data = msg.mentions.users.array()//returns an array with all the mentionned users

		let mentionned = data[0]//returns the first mentionned user with the command

		if (mentionned!=undefined) //verifying if there's a user tagged with the command
		{
			if (data.length==1)//verifying if only one user got tagged in the command
			{
				if(mentionned.displayAvatarURL.includes("?"))//verifying if the profile picture isn't too big
				{
					//if the profile picture is too big, removing the extra option at the end of the profile picture's URL
					let clean_avatar=mentionned.displayAvatarURL.split("?");
					chan.send("Here's "+mentionned.username+"'s profile picture, sorry no sorry for the tag friend",{files:[clean_avatar[0]]})
				}
				else
				{	
					chan.send("Here's "+mentionned.username+"'s profile picture, sorry no sorry for the tag friend",{files:[mentionned.displayAvatarURL]})
				}
			}else
			{	//if more than one user got tagged, ask for only one user tag
				chan.send("Hold on now, i can display only one profile picture at the time so please don't tag more than one user please.")
			}
		}
		else
		{
			chan.send('I need you to tag a user in this server so i can display his profile picture')
		}
	}

	if (command==prefix+"help")//command list settings
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
			.addField('janken <Pick>', 'play a round of rock paper scissors')
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

	if (command==prefix+"banword")//banword command manager
	{
		//creating a shortcut for the path
		let path = "./storage/"+msg.guild.id
		//checking ig the file related to the server exists and if it dosen't create it
		if (!fs.existsSync(path)) {fs.mkdirSync(path);}
		if (args[0]=="add")//command to add a word to the banword list
		{
			//setting a variable so we can check if the word is already on the list
			let Already_Banned=false

			//checking if the user has a role with administrator rights
			if(hasSpecificRight) 
			{
				//disabling the message removal 
				banAllow=false;

				//checking if there's only one word to ban
				if (args.length==2) 
				{	
					//checking if the banword file exists
					if (fs.existsSync(path+"/banword.json")) 
					{
						fs.readFile(path+"/banword.json", (err, data) => 
						{  
							if (err) throw err;
							let banwords = JSON.parse(data);
							for (var i = 0; i < banwords.banned_words.length; i++) 
							{
								//verifying if the word is already banned
								if(message.includes(banwords.banned_words[i])) 
								{
									Already_Banned=true
								}
							}
							if (Already_Banned)//in case the word is already banned
							{
								chan.send('that word is already on the banword list.')
							}
							else
							{	//if the word isn't banned yet
								//adding the word mentionned to the banword list
								banwords.banned_words.push(args[1]);
								let json = JSON.stringify(banwords);
								fs.writeFile(path+"/banword.json",json)//overwriting the JSON file of the banword list
								//sending comfirmation message
								chan.send('The word you mentionned is now on the banned_words list.',{files:[{attachment:'./img/All_done.png',name:'All_done.png'}]})
							}
						});
					}
					else
					{	//if the JSON file for the banword dosen't exist yet
						//configuring the JSON file for the banword list
						let banword_list =
						{
							banned_words: [args[1]]
						}
						let json = JSON.stringify(banword_list);
						fs.writeFile(path+"/banword.json",json)//creating the JSON file for the banword list
						//sending comfirmation message
						chan.send('The word you mentionned is now on the banned_words list.',{files:[{attachment:'./img/All_done.png',name:'All_done.png'}]})
					}
				}
				else
				{	//if multiple words are being mentionned in the command
					chan.send('Please put only one word to ban at the time.')
				}
			}
			else
			{	//in case the user dosen't have administrator rights
				chan.send("Sorry friend you're not allowed to use this command.")
			}
		}
		else if (args[0]=="show") 
		{
			//verifying the banword list's existence
			if(fs.existsSync("./storage/"+msg.guild.id+"/banword.json")) 
			{
				fs.readFile("./storage/"+msg.guild.id+"/banword.json", (err, data) => 
				{  
					if (err) throw err;
					let banwords = JSON.parse(data);//pulling the banned words from the JSON

					let banlist=banwords.banned_words[0]//putting the first banned word to start the list that'll be displayed
					//if there's multiple banned words, add the extra words to the banned words list
					if (banwords.banned_words.length>1) 
					{
						for (var i = 1; i < banwords.banned_words.length; i++) 
						{
							banlist+=", "+banwords.banned_words[i]
						}
						//displayed message if there's multiple words on the list
						chan.send("Here's the list of the banned words in this server: `"+banlist+"`")
					}
					else if(banwords.banned_words.length==1)
					{
						//in case there's only one banned word on the list
						chan.send('The only word banned here is: `'+banlist+'`')
					}
					else
					{
						//in case the list is empty
						chan.send('All words and languages are allowed here for now.')
					}
				});
			}
			else
			{	//in case the banword list dosen't exists
				chan.send('All words and languages are allowed here for now.')
			}
		}
		else if (args[0]=="remove")//other commands i need to do
		{
			if (hasSpecificRight) 
			{
				//verifying the banword list's existence
				if(fs.existsSync("./storage/"+msg.guild.id+"/banword.json")) 
				{
					fs.readFile("./storage/"+msg.guild.id+"/banword.json", (err, data) => 
					{ 
						let unbanned=false;
						if (err) throw err;
						let banwords = JSON.parse(data);//pulling the banned words from the JSON
						for (var i = 0; i < banwords.banned_words.length; i++) {
							if(args[1]==banwords.banned_words[i])
							{
								//verify if the word mentionned is in the banword list
								unbanned=true;
								banwords.banned_words.splice(i,1)
								let json = JSON.stringify(banwords);
								fs.writeFile(path+"/banword.json",json)//overwriting the JSON file of the banword list
								//sending comfirmation message
								chan.send("the word you mentionned is now unbanned.")
							}
						}
						if (!unbanned)
						{
							//if no words have been removed after checking
							chan.send("This word isn't in the banword list.")
						}
					});
				}
				else
				{	//in case the banword list dosen't exists
					chan.send("there's no words in the banword list to remove.")
				}
			}
			else
			{
				chan.send("Sorry friend you're not allowed to use this command.")
			}
		}
		else
		{
			//if the command sent dosen't match to any commands for the bot
			chan.send('What command do you want to use for "banword"? add, show, remove?')
		}
	}
	if (command==prefix+"report")//report command manager
	{
		//creating a shortcut for the path
		let path = "./storage/"+msg.guild.id
		//checking ig the file related to the server exists and if it dosen't create it
		if (!fs.existsSync(path)) {fs.mkdirSync(path);}
		if (args[0]=="user") 
		{
			let data = msg.mentions.users.array()//returns an array with all the mentionned users

			let mentionned = data[0]//returns the first mentionned user with the command
			if (mentionned!=undefined) //verifying if there's a user tagged with the command
			{
				if (data.length==1)//verifying if only one user got tagged in the command
				{
					if (fs.existsSync(path+"/report.json")) 
					{
						fs.readFile(path+"/report.json", (err, data) => 
						{  
							let json
							let already_reported=false
							if (err) throw err;
							let Reported = JSON.parse(data);
							for (var i = 0; i < Reported.users.length; i++) {
								if (Reported.users[i].user==args[1]) 
								{
									already_reported=true;
									Reported.users[i].reported++
									json = JSON.stringify(Reported);
								}
							}
							if (!already_reported) 
							{
								let reportTime = 1;
								let R_user = args[1]
								Reported.users.push({user:R_user, reported:reportTime})
								json = JSON.stringify(Reported);
							}
							fs.writeFile(path+"/report.json",json)
							//sending comfirmation message
							chan.send("The user you mentionned has been reported, sorry no sorry for the tag.")
						});
					}
					else
					{	//if the JSON file for the reports dosen't exist yet
						//configuring the JSON file for the reports
						let reportTime = 1;
						let R_user = args[1]
						let Reported =
						{
							users: [{user:R_user, reported:reportTime}]
						}
						let json = JSON.stringify(Reported);
						fs.writeFile(path+"/report.json",json)//creating the JSON file for the report list
						//sending comfirmation message
						chan.send("The user you mentionned has been reported, sorry no sorry for the tag.")
					}
				}else
				{	//if more than one user got tagged, ask for only one user tag
					chan.send("Please report one user at the time.")
				}
			}
			else
			{
				chan.send('I need you to tag the user you want to report.')
			}
		}
		else if(args[0]=="show")
		{
			if (hasSpecificRight) 
			{
				if (fs.existsSync(path+"/report.json")) 
				{
					fs.readFile(path+"/report.json", (err, data) => 
					{
						let Reported = JSON.parse(data);
						let s=""
						if (Reported.users[0].reported>1) {s="s"}// verifying if the user has been reported multiple times
						let report_list=Reported.users[0].user+": "+Reported.users[0].reported+" time"+s
						for (var i = 1; i < Reported.users.length; i++) 
						{
							if (Reported.users[i].reported>1) {s="s"}else{s=""}// verifying if the user has been reported multiple times
							report_list+=", "+Reported.users[i].user+": "+Reported.users[i].reported+" time"+s
						}
						//sending the final message in the author's DM
						Author.sendMessage("Reporting for duty, here' the list of the users that got reported in "+serv+": "+report_list)
					});
				}
				else
				{
					chan.send('No users have been reported yet.')
				}
			}
			else
			{
				chan.send("Sorry friend you're not allowed to use this command.")
			}
		}
		else
		{
			chan.send('What command do you want to use for "report"? user(beta), show(tba)')
		}
	}
	if (command==prefix+"roll")//roll command settings
	{
		//default values
		let DiceNumber = 1
		let nbFaces = 6

		//argument verification
		if(args[0]!=undefined)
		{
			if (!isNaN(args[0])) 
			{
				nbFaces=args[0];
			}else{
				chan.send('Invalid number of faces');return
			}
		}
		if (args[1]!=undefined)
		{
			if (!isNaN(args[1])) 
			{
				DiceNumber=args[1];
			}else{
				chan.send('Invalid numberof dice(s)');return
			}
		}

		//error manager
		if (nbFaces>999) {chan.send("That's quite a bit of faces, in fact that's too many faces, please put less than 1000 faces."); return}
		if (nbFaces<3) {chan.send("What's the point of rolling a dice that dosen't even have multiple faces? That's right, no point at all so please put at least 3 faces."); return}
		if (DiceNumber>10) {chan.send("Hold on now, there's too many dices, maximum of 10 please.");return}
		if (DiceNumber<1) {chan.send("You wanna roll the dice(s) yes or no? If so roll at least 1 dice.");return}
		
		//creation of the required element
		let dices=[];
		let total=0;
		let dice_list="";

		//rolling the right amount of dices
		for (var i = 0; i < DiceNumber; i++) {
			let result=utils.rand(nbFaces)
			//pushing the dice's result into an array
			dices.push(result);
			//modifying the total value of the roll
			total+=result;
			//creating the list of results the roll gave
			dice_list+=result;
			if (i!=DiceNumber-1) 
			{
				dice_list+=", ";
			}
		}
		//make the difference between a single dice roll and multiple dices roll
		//and return the message with the result of the roll
		if (DiceNumber==1) 
		{
			chan.send('You rolled a '+total)
		}
		else
		{
			chan.send('You rolled '+total+' ('+dice_list+")");
		}
	}
	for (var i = 0; i <command_todo.length; i++) 
	{
		if (command==prefix+command_todo[i]) 
		{
			//in case the user istrying to use an uncomplete command
			chan.send("Sorry this function is still underdeveloppement please be patient while i'm working on it.",{files:[{attachment:'./img/tba.png',name:'tba.png'}]})
		}
	}
	//verification for banned words being used
	if(fs.existsSync("./storage/"+msg.guild.id+"/banword.json")&& banAllow) 
	{
		fs.readFile("./storage/"+msg.guild.id+"/banword.json", (err, data) => {  
			if (err) throw err;
			let banwords = JSON.parse(data);
			if (command!=prefix+"banword")
			{
				for (var i = 0; i < banwords.banned_words.length; i++) {
					if(message.includes(banwords.banned_words[i])) 
					{
						//if a word matches with one of the words on the banword list
						//deleting and warning the user
						msg.delete()
						chan.send(Angry[Math.floor(Math.random()*Angry.length)])
					}
				}
			}
		});	
	}
});
console.log("bot is running");//sending to the console that the bot started proprely
bot.login('NDE0ODA5NzkzNjA2MzIwMTI4.DYLkSA.fZxIcJ8bPzNkEUVtNq4V8kvIETY');//bot tokken
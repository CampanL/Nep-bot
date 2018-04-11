const fs = require('fs');

exports.banword = (msg, message, args, chan, AdministratorRight) =>
{
		//creating a shortcut for the path
		let path = "./storage/"+msg.guild.id
		if (args[0]==="add")//command to add a word to the banword list
		{

			//checking if the user has a role with administrator rights
			if(!AdministratorRight) 
			{	//in case the user dosen't have administrator rights
				chan.send("Sorry friend you're not allowed to use this command.");return
			}

			//checking if there's only one word to ban
			if (args.length>2) 
			{	
				//if multiple words are being mentionned in the command
				chan.send('Please put only one word to ban at the time.');return
			}

			fs.readFile(path+"/banword.json", (err, data) => 
			{  
				if (err) throw err;
				let banwords = JSON.parse(data);
				for (var i = 0; i < banwords.banned_words.length; i++) 
				{
					//verifying if the word is already banned
					if(message.includes(banwords.banned_words[i])) 
					{
						chan.send('that word is already on the banword list.');return
					}
				}
				//if the word isn't banned yet
				//adding the word mentionned to the banword list
				banwords.banned_words.push(args[1]);
				let json = JSON.stringify(banwords);
				fs.writeFile(path+"/banword.json",json)//overwriting the JSON file of the banword list
				//sending comfirmation message
				chan.send('The word you mentionned is now on the banned_words list.',{files:[{attachment:'./img/All_done.png',name:'All_done.png'}]});return
			});
		}
		else if (args[0]==="show") 
		{
			fs.readFile(path+"/banword.json", (err, data) => 
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
				else if(banwords.banned_words.length===1)
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
		else if (args[0]==="remove")//other commands i need to do
		{
			if (!AdministratorRight) //verifying if the role has administratorright
			{
				chan.send("Sorry friend you're not allowed to use this command.");return
			}
			fs.readFile(path+"/banword.json", (err, data) => 
			{ 
				let unbanned=false;
				if (err) throw err;
				let banwords = JSON.parse(data);//pulling the banned words from the JSON
				//checking if the banword list isn't empty
				if (banwords.banned_words.length===0) {chan.send("there's no words in the banword list to remove.");return}
				
				for (var i = 0; i < banwords.banned_words.length; i++) {
					if(args[1]===banwords.banned_words[i])
					{
						//verify if the word mentionned is in the banword list
						banwords.banned_words.splice(i,1)
						let json = JSON.stringify(banwords);
						fs.writeFile(path+"/banword.json",json)//overwriting the JSON file of the banword list
						//sending comfirmation message
						chan.send("the word you mentionned is now unbanned.");return
					}
				}
				//if no words have been removed after checking
				chan.send("This word isn't in the banword list.")
			});
		}
		else if (args[0]==="clear") 
		{
			//checking if the user has a role with administrator rights
			if(!AdministratorRight) 
			{	//in case the user dosen't have administrator rights
				chan.send("Sorry friend you're not allowed to use this command.");return
			}

			fs.readFile(path+"/banword.json", (err, data) =>
			{
				let banwords = JSON.parse(data);//pulling the banned words from the JSON
				//checking if the banword list isn't empty
				if (banwords.banned_words.length===0) {chan.send("there's no words in the banword list to remove.");return}
				banwords.banned_words.splice(0,banwords.banned_words.length)
				let json = JSON.stringify(banwords);
				fs.writeFile(path+"/banword.json",json)//overwriting the JSON file of the banword list
				chan.send('Banword list is now empty',{files:[{attachment:'./img/all-good.png',name:'all-good.png'}]});return
			})
		}
		else
		{
			//if the command sent dosen't match to any commands for the bot
			chan.send('What command do you want to use for "banword"? add, show, remove, clear?')
		}
	}
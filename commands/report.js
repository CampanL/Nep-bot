const fs=require('fs')
exports.report = (Author, msg, args, chan, AdministratorRight, serv) =>
{
		//creating a shortcut for the path
		let path = "./storage/"+msg.guild.id
		//checking ig the file related to the server exists and if it dosen't create it
		if (!fs.existsSync(path)) {fs.mkdirSync(path);}
		if (args[0]==="user") 
		{
			let data = msg.mentions.users.array()//returns an array with all the mentionned users
			let mentionned = data[0]//returns the first mentionned user with the command

			//error manager			
			if (mentionned==undefined) //verifying if there's a user tagged with the command
			{chan.send('I need you to tag the user you want to report.');return}
			if (mentionned.bot) //if the user tries to report a bot
			{chan.send("You're not going to report a bot are you?");return}
			if (data.length>1)//verifying if only one user got tagged in the command
			{chan.send("Please report one user at the time.");return}
			if(Author===mentionned)//if the user tries to report himself
			{chan.send("Wait a second, you're trying to report yourself? realy? I'm not letting you do that friend, this is just stupid.");return}			
			

			//sending comfirmation message
			chan.send("The user you mentionned has been reported, sorry no sorry for the tag.")
			fs.readFile(path+"/report.json", (err, data) => 
			{  
				let json
				let already_reported=false
				if (err) throw err;
				let Reported = JSON.parse(data);
				for (var i = 0; i < Reported.users.length; i++) 
				{
					if (Reported.users[i].user===args[1]) 
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
			});
		}
		else if(args[0]==="show")
		{
			//error manager
			if (!AdministratorRight) //verifying if the user has administrator rights
			{chan.send("Sorry friend you're not allowed to use this command.");return}
			if (!fs.existsSync(path+"/report.json")) //verifying if someone has been reported before
			{chan.send('No users have been reported yet.');return}
			
			fs.readFile(path+"/report.json", (err, data) => 
			{
				let Reported = JSON.parse(data);
				let s=""

				//if the list of reported users is empty
				if (Reported.users===0){chan.send('No users have been reported yet.');return}
				
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
			chan.send('What command do you want to use for "report"? user, show?')
		}
	}
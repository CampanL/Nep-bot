const Discord 		= require('discord.js');
const bot 			= new Discord.Client();
const fs 			= require('fs');
const utils 		= require('./utils.js')
const banword 		= require('./commands/banword.js')
const report 		= require('./commands/report.js')
const roll 			= require('./commands/roll.js')
const leaderboard 	= require('./commands/leaderboard.js')
const avatar 		= require('./commands/avatar.js')
const janken 		= require('./commands/janken.js')
const help 			= require('./commands/help.js')

const guildArray 	= bot.guilds.array();

//Introduction message when bot joins a server
bot.on("guildCreate", guild => {
	//creating the storrage file of the guild
	if (!fs.existsSync("./storage/"+guild.id)){fs.mkdirSync("./storage/"+guild.id)};

	let guildChannels = guild.channels;
	let textChannels = [];
	guildChannels.forEach(channel => {
	    if(channel.type === "text") {
	        let channelPermissions = channel.permissionsFor(bot.user);
	        let hasSendPermssion = channelPermissions.has("SEND_MESSAGES");
	        let hasWatchPermission = channelPermissions.has("READ_MESSAGES");
	        if(hasSendPermssion && hasWatchPermission) {
	            textChannels.push(channel);
	        }
	    }
	})
    textChannels[0].send("Hello there, allow me to present myself. I'm Nep-bot here to help you moderate your server and kill some time you can see the command list by typing \"_help\"")

    if (!fs.existsSync("./storage/"+guild.id+"/money.json")) 
    {	
    	//creating the currency systeme
    	let money={
    		users:[]
    	}
    	//adding every users to the money database
    	let guildArray = guild.members.array()
    	for (var i = 0; i < guildArray.length; i++) {
    		if (!guildArray[i].user.bot){money.users.push({money:5000,user:{username:guildArray[i].user.username,id:guildArray[i].user.id}})}
    	}
		//creating the money file
		let json = JSON.stringify(money);
		fs.writeFile("./storage/"+guild.id+"/money.json",json)
    }

    if (!fs.existsSync("./storage/"+guild.id+"/banword.json")) 
    {
    	//creating the banword list
    	let banword_list =
    	{
    		banned_words: []
    	}
    	let json = JSON.stringify(banword_list);
    	fs.writeFile("./storage/"+guild.id+"/banword.json",json)//creating the JSON file for the banword list
    }

    if (!fs.existsSync("./storage/"+guild.id+"/report.json")) 
    {	//creating the report file
    	let Reported =
    	{
    		users: []
    	}
    	let json = JSON.stringify(Reported);
    	fs.writeFile("./storage/"+guild.id+"/report.json",json);return//creating the JSON file for the report list
    }
    if (fs.existsSync("./storage/challenges")){fs.mkdirSync("./storage/challenges")}
})
//Event when a new user joins the guild
bot.on("guildMemberAdd", (member) => {
  //adding the user to the money JSON
  fs.readFile("./storage/"+member.guild.id+"/money.json", (err, data) => 
  {  
  	if (err) throw err;
  	let money = JSON.parse(data);
  	for (var i = 0; i < money.users.length; i++) {
  		if(member.id===money.users[i].user.id)return
  	}
  	money.users.push({money:5000,user:{username:member.user.username,id:member.user.id}})
  	//overrwriting the money file
  	let json = JSON.stringify(money);
	fs.writeFile("./storage/"+member.guild.id+"/money.json",json)
  });
});
let command_todo=[]
//array for the bot's reaction when a banned word is being used
const Angry = ["Now hold on there friend, you're not allowed to say that in here understood?",
			   "Say that one more time and i'll nep you up.",
			   "Hey don't say something like that in here, are you crazy?",
			   "What did you just try to say? That's what i thought, you ain't saying anything.",
			   "Please don't use such words in here that's disrespectfull."]

/*
handler = [] 
handler.push(new GameHandler({ state: ... }))

actionList = []
// actionList.push(new SendTextAction({message: "toto", when: "2018-4-22 15:33:12+2UTC"}))
while(true) {
  currentAction = actionList.pop()
  if (currentAction.when > currentDate ) { 
  	// dans le futur
    actionList.push(currentAction)
  } else {
  	// executer l'action*
  	currentAction.perform()
  }
}
*/

bot.on('message', (msg)=>
{
	if (!msg.member) return;
	AdministratorRight = false;
	msg.member.roles.forEach(role => 
	{
		if(role.hasPermission("ADMINISTRATOR") === true)
		{
			AdministratorRight = true;
		}
	})

	//command shortcuts
	let message = msg.content.toLowerCase();//represents the message's content in lower case
	let chan = msg.channel;//represents the channel where to command got sent
	let serv = msg.guild.name;//return the name of the guild/server
	let Author = msg.author;//represents the author of the message containing the command
	let prefix = "_";//represents the prefix that needs to be used to enter a command
	let args = msg.content.toLowerCase().trim().split(/ +/g);//put the message's content into an array where each words represents an argument
 	let command = args.shift().toLowerCase();//set the first argument as the command

	if (Author.bot)return;//make the bot ignoring itself

	if (message.includes('pudding'))//fun little RP feature
	{
		chan.send('Pudding? Where? Gimme that pudding! **I WANT PUDDING**');return
	}

	//command list settings
	if (command===prefix+"help")
	{
		help.help(chan, bot, prefix)
	}
	
	//setting up the leaderboard
	if (command===prefix+"leaderboard")
	{
		leaderboard.leaderboard(chan, msg)
	}

	//command to display a user's avatar 
	{
	if (command===prefix+"avatar")
		avatar.avatar(chan, msg)
	}

	//banword command manager
	if (command===prefix+"banword")
	{
		banword.banword(msg, message, args, chan, AdministratorRight);
	}

	//report command manager
	if (command===prefix+"report")
	{
		report.report(Author, msg, args, chan, AdministratorRight, serv);
	}
	
	//roll command settings
	if (command===prefix+"roll")
	{
		roll.roll(args, chan)
	}

	//rock paper scissors command settings
	if (command===prefix+'janken')
	{
		janken.janken(chan, msg, args, Author)
	}

	//error message for the commands still under construction
		for (var i = 0; i <command_todo.length; i++) 
		{
			if (command===prefix+command_todo[i]) 
			{
				//in case the user istrying to use an uncomplete command
				chan.send("Sorry this function is still underdeveloppement please be patient while i'm working on it.",{files:[{attachment:'./img/tba.png',name:'tba.png'}]})
			}
	}

	//verification for banned words being used
	if(fs.existsSync("./storage/"+msg.guild.id+"/banword.json")&&command!=prefix+"banword") 
	{
		fs.readFile("./storage/"+msg.guild.id+"/banword.json", (err, data) => {  
			if (err) throw err;
			let banwords = JSON.parse(data);
			for (var i = 0; i < banwords.banned_words.length; i++) {
				if(message.includes(banwords.banned_words[i])) 
				{
					//if a word matches with one of the words on the banword list
					//deleting and warning the user
					msg.delete()
					chan.send(Angry[utils.rand(Angry.length)])
				}
			}
		});	
	}
});
//handlers.each((handler) => {
//	handler.handle(msg)
//} )
console.log("bot is running");//sending to the console that the bot started proprely
bot.login("I AIN'T GIVIN YA MY BOT'S TOKKEN");//bot tokken
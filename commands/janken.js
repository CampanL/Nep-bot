const fs 	= require('fs')
const utils = require('../utils.js')

exports.janken = (chan, msg, args, Author)=>
{
	let path = "./storage/"+msg.guild.id
	let bet = args[1]
	let Upick;
	let Bpick=utils.rand(3)-1;
	let gain = 0
	let playerPoints=""
	let reward = ["","",""]
	const multiplier=[1,0,2]
	let ready=false

	//array for the different user pick
	const rock = [":fist::skin-tone-1: ",":raised_hand_with_fingers_splayed::skin-tone-1: ",":v::skin-tone-1: "];
	const paper = [":raised_hand_with_fingers_splayed::skin-tone-1: ",":v::skin-tone-1: ",":fist::skin-tone-1: "];
	const scissors = [":v::skin-tone-1: ",":fist::skin-tone-1: ",":raised_hand_with_fingers_splayed::skin-tone-1: "];
	
	//array for the different reactions of the bot
	const comment = 
	[ 	//draw
		["Oh wow, well looks like no one wins this time.",
		"Ooooh a draw, welp watch this i'm gonna win this time.",
		"A draw? Really? Damn i thought i was going to win this round."
		],//bot won
		["**YES** i won! HAHAHA i'm too good at this game.",
		"Haha, victory is mine!",
		"Nice i won that round, how you feeling about that? Nevermind i don't care HAHAHA!!"
		],//user won
		["Dangit, i lost... I'LL WIN NEXT TIME JUST YOU SEE.",
		"Haaa i lost... **I saw you cheat** don't lie, you looked at my hand.",
		"Oh you won, nice... Good for you... Me? Mad? HAHA no way. *internally rages*"]
	];

	//attributing the right array in fucntion of the user's pick
	if (args[0]==="rock") {Upick=rock}
	else if (args[0]==="paper") {Upick=paper}
	else if (args[0]==="scissors") {Upick=scissors}
	else{chan.send("Sorry i don't understand your choice, please choose between rock, paper and scissors");return}

	if (bet!=undefined)
	{
		if (!isNaN(Number(bet)))
		{
			fs.readFile(path+"/money.json", (err, data) => 
			{  
				if (err) throw err;
				reward = [" Here take your bet back.", " Too bad you lost your bet.", " Anyway here's your gain."]
				let money = JSON.parse(data);
				let users = money.users
				for (var i = 0; i < users.length; i++) {
					if (users[i].user.id===Author.id&&bet>0)
					{ 	
						if (bet>users[i].money) {chan.send("Sorry friend you do not have enough :moneybag: for that bet");return}
						gain+=(bet*multiplier[Bpick])-bet
						users[i].money+=gain
						playerPoints=" You now have: "+users[i].money+" :moneybag: "
						if (users[i].money===0){users[i].money+=100; playerPoints=" Oops, looks like you ran out of :moneybag: ok here's 100 points, make sure you don't waste them."}
						let json = JSON.stringify(money);
						fs.writeFileSync(path+"/money.json",json)
						chan.send(Upick[0]+" VS "+Upick[Bpick]+comment[Bpick][utils.rand(3)-1]+reward[Bpick]+playerPoints);return
					}
				}
			});
		}else{chan.send("please put a valid number for your bet");return}
	}else(ready=true)

	if(ready){chan.send(Upick[0]+" VS "+Upick[Bpick]+comment[Bpick][utils.rand(3)-1])}
}
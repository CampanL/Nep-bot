const utils = require('../utils.js')

exports.roll = (args, chan)=>
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
				chan.send('Invalid number of dice(s)');return
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
		if (DiceNumber===1) 
		{
			chan.send('You rolled a '+total)
		}
		else
		{
			chan.send('You rolled '+total+' ('+dice_list+")");
		}
	}
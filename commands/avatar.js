exports.avatar=(chan, msg)=>
{
	let data = msg.mentions.users.array()//returns an array with all the mentionned users
	let mentionned = data[0]//returns the first mentionned user with the command

	//error manager
	if (mentionned===undefined) //verifying if there's a user tagged with the command
	{chan.send('I need you to tag a user in this server so i can display his profile picture');return}
	if (data.length>1)//if more than one user got tagged, ask for only one user tag
	{chan.send("Hold on now, i can display only one profile picture at the time so please don't tag more than one user please.");returns}
	
	if(mentionned.displayAvatarURL.includes("?"))//verifying if the profile picture isn't too big
	{
		//if the profile picture is too big, removing the extra elements at the end of the profile picture's URL
		let clean_avatar=mentionned.displayAvatarURL.split("?");
		chan.send("Here's "+mentionned.username+"'s profile picture, sorry no sorry for the tag friend",{files:[clean_avatar[0]]});return
	}
	chan.send("Here's "+mentionned.username+"'s profile picture, sorry no sorry for the tag friend",{files:[mentionned.displayAvatarURL]})
}
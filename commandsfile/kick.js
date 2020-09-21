module.exports = {
  name: 'kick',
  cname:'kick',
  description: 'kick a member',
  cd:3,
	execute(message,Discord) {
        try{
        var toKick = message.mentions.members.first()
        if(toKick.user.id==='717948253093756969'){
            return message.channel.send('Noooo I dun wanna leave:((')
        }
        if(toKick.user.id===message.guild.ownerID){
            return message.channel.send('You can\'t kick the owner of the server!')
        }
        if(toKick.user.id===message.author.id){
            return message.channel.send('You can\'t kick yourself! Why would you do that?')
        }
        message.channel.send(`Sure, <@${message.author.id}>, please check your DMs.`)
        const getResp = x =>x
      message.author.send('Please provide a reason. Type "n" or "N" to skip!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
      .then(()=>message.author.dmChannel.awaitMessages(getResp,{max:1,time:60000 ,errors:['time']})
      .then(resp=>{
        if(resp.first().content.toLowerCase()=='n'){
            message.author.send("Okay, I've got this!").catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            toKick.kick()
            return message.channel.send(`${toKick.user.username} has been kicked from the server.`)
         }
          message.author.send("Okay, I've got this!")
          function executeKick(){
            toKick.kick() 
            message.channel.send(`${toKick.user.username} has been kicked from the server.`)
          }
          toKick.user.send(`You have been removed from ${toKick.guild.name} for the following reason(s):\n${resp.first().content}`).catch(e=>console.log(e))
          setTimeout(executeKick,2000)
      }).catch(e=>{
          message.author.send('An error occurred, probably due to a lack of valid response or permissions. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        })
      ).catch(e=>message.author.send('An error occurred, probably due to a lack of valid response. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
        }catch(e){
            message.channel.send('There was an error, please try again.')
        }
    }, 

};
module.exports = {
	name: 'ban',
  description: 'ban a member',
  cname:'ban',
  cd:3,
	execute(message,Discord,banned) {
    try{
        var toBan = message.mentions.members.first()
        if(toBan.user.id==='717948253093756969'){
            return message.channel.send('Noooo I dun wanna leave:((')
        }
        if(toBan.user.id===message.guild.ownerID){
            return message.channel.send('You can\'t ban the owner of the server!')
        }
        if(toBan.user.id===message.author.id){
            return message.channel.send('You can\'t ban yourself! Why would you do that?')
        }
        message.channel.send(`Sure, <@${message.author.id}>, please check your DMs.`)
        const getResp = x =>{
                return x.content    
        }
      message.author.send('Please provide a reason. Type "n" or "N" to skip!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
      .then(()=>message.author.dmChannel.awaitMessages(getResp,{max:1,time:60000 ,errors:['time']})
      .then(resp=>{
        if(resp.first().content.toLowerCase()=='n'){
           message.author.send("Okay, I've got this!").catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
           message.guild.members.ban(toBan)
           return message.channel.send(`${toBan.user.username} has been banned from the server.`)
        }
          message.author.send("Okay, I've got this!")
        //  banned.set(toBan.user.id,toBan)
          toBan.user.send(`You have been banned from ${toBan.guild.name} for the following reason(s):\n${resp.first().content}`).catch(e=>console.log(e))
          function executeBan(){
          message.guild.members.ban(toBan)
          }
          setTimeout(executeBan,2000)
          message.channel.send(`${toBan.user.username} has been banned from the server.`)
      }).catch(e=>{
          message.author.send('An error occurred, probably due to a lack of valid response or permissions. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        })
      ).catch(e=>message.author.send('An error occurred, probably due to a lack of valid response. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
      }catch(e){
        message.channel.send('There was an error. Please try again.')
      }
    },

};
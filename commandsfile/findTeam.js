const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'findteam',
    cname:'team',
    description:'Start a team and look for members',
    cd:3,
	execute(message,prefix,Discord,teams,schedule) {
        try{
       const ins = new Discord.Collection()
            var settings = []
            //team size, additional details, game 
            const teamSize = x =>{
                if(x.content<2){
                    message.author.send('You will need at least 2 people to form a team! Please input a number larger than 1.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                }
                return(
                Number(x.content) 
                &&  Number(x.content)>1
                )
            }
            const getName = x=>x.content
            message.channel.send(`<@${message.author.id}> Okay, I will drop you a DM`)
            message.author.send('How many people do you need in your team (including yourself)?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>
            message.author.dmChannel.awaitMessages(teamSize,{max:1,time:300000,errors:['time']})
            .then(number=>{
                settings.push(number.first().content)
                message.author.send('What is the game that you are playing?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>
                message.author.dmChannel.awaitMessages(getName,{max:1,time:300000,errors:['time']})
                .then(name=>{
                    settings.push(name.first().content)
                    message.author.send('Please input any additional details in one message (e.g. Need to be at least level 10...)').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                    .then(()=> 
                message.author.dmChannel.awaitMessages(getName,{max:1,time:300000,errors:['time']})
                .then(details=>{
                    settings.push(details.first().content)
                    teams.set(message.author.id,{server:message.guild.id,leader:message.author,size:settings[0],game:settings[1],details:settings[2],instructions:'',members:new Discord.Collection})
                    teams.find(x=>x.leader.id===message.author.id).members.set(message.author.id,message.author)
                    
                    function updateSend(instructions){
                    let teamFindMsg = new Discord.MessageEmbed()
                    .setTitle('TEAM UP')
                    .setDescription(`${settings[2]}`)
                    .addField('Team Leader:',`${message.author.username}(#${message.author.discriminator})`)
                    .addField('Game:',settings[1])
                    .addField(`Team Members (${teams.find(x=>x.leader.id===message.author.id).members.array().length}/${settings[0]} + 2 reserves)`,teams.find(x=>x.leader.id===message.author.id).members.map((p)=>`${p.username}`))
                    .setFooter('Press ⬆️ to join')
                   
                    
                    var firstRun=true
                  var timer= schedule.scheduleJob(new Date(Date.now() + 3600000), function(){
                    if(!firstRun){
                        let nofinalteamFindMsg = new Discord.MessageEmbed()
                        .setTitle('TEAM UP')
                        .setDescription(`${settings[2]}`)
                        .addField('Team Leader:',`${message.author.username}(#${message.author.discriminator})`)
                        .addField('Game:',settings[1])
                         .addField(`Team Members (${teams.find(x=>x.leader.id===message.author.id).members.array().length}/${settings[0]} + 2 reserves )`,teams.find(x=>x.leader.id===message.author.id).members.map((p)=>`${p.username} (#${p.discriminator})`))
                        .setFooter('TEAM IS NOT FILLED. TEAM FINDING HAS CONCLUDED AFTER 1H.')

                        let snofinalteamFindMsg = new Discord.MessageEmbed()
                        .setTitle('TEAM UP')
                        .setDescription(`${settings[2]}`)
                        .addField('Team Leader:',`${message.author.username}(#${message.author.discriminator})`)
                        .addField('Game:',settings[1])
                        .addField(`Team Members (${teams.find(x=>x.leader.id===message.author.id).members.array().length}/${settings[0]} + 2 reserves )`,teams.find(x=>x.leader.id===message.author.id).members.map((p)=>`${p.username}`))
                        .setFooter('TEAM FINDING OUTCOME. TEAM FINDING HAS CONCLUDED AFTER 1H.')
                        message.author.send(nofinalteamFindMsg).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                        message.channel.send(snofinalteamFindMsg)
                        teams.delete(message.author.id)
                        timer.cancel()
                    } 
                    firstRun=false
                 //    console.log('hi')
                   //  console.log(teams)
                      });
                      
                 
                   //   console.log(teams.find(x=>x.leader===message.author).members)
                   const getReaction = (r,u) =>teams.find(x=>x.leader.id===message.author.id).members.array().indexOf(u)==-1 && (r._emoji.name==='⬆️' && !u.bot)
                   //teams.find(x=>x.leader.id===message.author.id).members.array().indexOf(u)==-1 && r._emoji.name==='⬆️'
                  //get reaction filter is not working
         
                   message.channel.send(teamFindMsg).then((x)=>x.react('⬆️')
                    .then(u=>u.message.awaitReactions(getReaction,{max:1,time:3600000,errors:['time']})
                    .then((m)=>{ 
                        m.first().users.cache.find(user=>!user.bot).send(`You have registered your interest in joining ${message.author.username}\'s team. The following are the instructions for the team:\n${instructions}`).catch(e=>e.httpStatus==403?message.author.send(`I could not send your team instructions to ${m.first().users.cache.find(user=>!user.bot).username} as the user may have disabled messages from bots`):console.log(e))
                        teams.find(x=>x.leader===message.author).members.set( m.first().users.cache.find(user=>!user.bot).id,m.first().users.cache.find(user=>!user.bot))
                       
                       if(teams.find(x=>x.leader.id===message.author.id).members.array().length<teams.find(x=>x.leader.id===message.author.id).size+2){
                        function delMsg(){
                            m.first().message.delete()
                        }
                        setTimeout(delMsg,1200)
                       
                        return updateSend(instructions)//here
                       }else{
                        m.first().message.delete()
                        let finalteamFindMsg = new Discord.MessageEmbed()
                        .setTitle('TEAM UP')
                        .setDescription(`${settings[2]}`)
                        .addField('Team Leader:',`${message.author.username}(#${message.author.discriminator})`)
                        .addField('Game:',settings[1])
                        .addField(`Team Members (${teams.find(x=>x.leader.id===message.author.id).members.array().length}/${settings[0]} + 2 reserves)`,teams.find(x=>x.leader.id===message.author.id).members.map((p)=>`${p.username}`))
                        .setFooter('TEAM FULL')

                        let authorfinalteamFindMsg = new Discord.MessageEmbed()
                        .setTitle('TEAM UP')
                        .setDescription(`${settings[2]}`)
                        .addField('Team Leader:',`${message.author.username}(#${message.author.discriminator})`)
                        .addField('Game:',settings[1])
                        .addField(`Team Members (${teams.find(x=>x.leader.id===message.author.id).members.array().length}/${settings[0]} + 2 reserves)`,teams.find(x=>x.leader.id===message.author.id).members.map((p)=>`${p.username} (#${p.discriminator})`))
                        .setFooter('TEAM FULL')
                           message.author.send(authorfinalteamFindMsg)
                           message.channel.send(finalteamFindMsg) 
                           teams.delete(message.author.id)
                           timer.cancel()
                           message.author.send('Cheers, you have a full team now!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                           return
                       }
                     
                }).catch(e=>console.log(e))
                    ).catch(e=>console.log(e))
                    ).catch(e=>{console.log(e)})
            }
            message.author.send('What instructions do you have for your team?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>
            message.author.dmChannel.awaitMessages(getName,{max:1,time:300000,errors:['time']})
            .then(instructions=>{
                settings.push(instructions.first().content)
                updateSend(instructions.first().content)
                ins.set(message.author.id,instructions.first().content)
                message.author.send('Done! You will be notified once your team is filled. Team finding ends after 1h.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            }) 
            ).catch(e=>console.log(e)) 
                }).catch(e=>console.log(e))
                )}).catch(e=>console.log(e))
                ).catch(e=>console.log(e)) 
            }).catch(e=>console.log(e))
            ).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots.`):console.log(e))
        

        }catch(e){
            console.log(e)
            message.channel.send('There was an error. Please try again.')
        }
       
}
}
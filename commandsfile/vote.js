const Discord = require('discord.js');
const axios = require('axios');
var shortid = require('shortid');
module.exports = {
    name: 'vote',
    cname:'holdref',
    description:'hold a referendum',
    cd:3,
	execute(message,prefix,Discord,votes,voteperiod,schedule,client) {
        var voteid;
        const filter =(x) => x.content && !x.author.bot
        const getOptions=(num,vt,vsn)=>{
            message.author.send('What\'s the option?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            .then(()=>message.author.dmChannel.awaitMessages(filter,{max:1,time:120000,errors:['time']}
            ).then(options=>{
                let val = options.first().content
                votes.find(x=>x.sn==vsn).choices.set(num,{
                    name:`${val}`,
                    count:0,
                    id:num
                })
                return choose(num,vt,vsn)
                //choose(num)
               // console.log(votes)
            }).catch(e=>console.log(e))
            )
            .catch(e=>console.log(e))
        }

        const choose =(i,vt,vsn)=>message.author.send(`to add more options, type "${prefix} addoption"\nTo conclude, type "${prefix} startvote"`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        .then(()=>message.author.dmChannel.awaitMessages(filter,{max:1,time:60000,errors:['time']})
            .then(c=>{
                let r=c.first().content.toLowerCase()
                if(r===`${prefix} addoption`){
                    i+=1
                    return getOptions(i,vt,vsn)
                }else{
                    message.author.send('How long do you want the referendum to be? Enter the number in hours.(i.e 0.5 for 30 minutes)').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                    .then(()=>message.author.dmChannel.awaitMessages(x=>x,{max:1,time:60000,errors:['time']})
                    .then(hora=>{
                        var duration = Number(eval(hora.first().content))*60000
                        var optionlist =[]
                        var tl = votes.find(x=>x.sn==vsn).title
                           votes.find(x=>x.sn==vsn).choices.map(x=>{
                               optionlist.push(`\n${x.id} - ${x.name}`)
                            })
                            optionlist = 'OPTIONS (OPTION-CODE - OPTION NAME)'.concat(optionlist)
                              let votepanel = new Discord.MessageEmbed()
                              .setColor('#ffffff')
                              .setTitle(vt)
                              .addField('Vote ID:',`${vsn}`,true)
                              .setDescription(optionlist)
                              .setFooter('Type -vote to vote! Each user can only vote once')    
                          message.channel.send(votepanel)
                          var now = Date.now()
                          let et = now + duration
                         // console.log(duration)
                          voteperiod.set(voteid,{title:tl,id:voteid,end:et})
                          //here
                          schedule.scheduleJob(new Date(et), function(){
                            var k=vsn
                            client.commands.get('concludevote').execute(votes,Discord,k,client)
                          });
                          message.author.send('Done! Your vote has been set.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                    }).catch(e=>console.log(e))
                    ).catch(e=>console.log(e))
                }
            }).catch(e=>console.log(e))
        ).catch(e=>console.log(e))
        

        message.author.send('What title would you like for your vote?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        .then(()=>message.author.dmChannel.awaitMessages(x=>x,{max:1,time:120000,errors:['time']})
            .then(titlef=>{
                let vt = titlef.first().content
            //    if(votes.array().some(x=>x.title===vt)){
              //      return message.author.send('Sorry, the name has already been used. Please restart the process')
                //}
                var vsn =votes.array().length+1
                //shortid.generate()
                votes.set(vt,{title:`${vt}`,sn:vsn,voters:[],serverID:message.guild.id,channelID:message.channel.id,choices:new Discord.Collection()})
                votes.array().map((x,i)=>{
                        if(x.sn===vsn){
                        voteid =i
                                }
                           })
                         var i=0
                      // var i=null
                        getOptions(i,vt,vsn)     
            }).catch(e=>console.log(e))
        )
        .catch(e=>console.log(e))

}
}

var moment = require('moment-timezone');
module.exports = {
    name: 'reminder',
    cname:'mreminder',
    description: 'set a reminder',
    cd:3,
	execute(message,con,Discord) {
        var reminderData=[];
        const getRN = x => message.author.id === x.author.id
        const getRes = (r,u) => (r._emoji.name==='⏰' || r._emoji.name==='🔍')  && !u.bot;
        const getInfo = x => message.author.id === x.author.id
        const ct = x => message.author.id === x.author.id  && x.content.match(/[0-9]{2}\:[0-9]{2}/g)
        const getTime =x => message.author.id === x.author.id && x.content.match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)
        message.channel.send('Sure, check your DMs!')

//name,datetime,info
        message.author.send('What is the title of your reminder?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        .then(()=>message.author.dmChannel.awaitMessages(getRN,{max:1,time:180000,errors:['time']})
        .then(name=>{
            reminderData.push(name.first().content)
            message.author.send('All timings entered should be in GMT. Enter the date to be reminded in the format DD/MM/YYYY (1 is 01,2 is 02 and so on...) :').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            .then(()=>message.author.dmChannel.awaitMessages(getTime,{max:1,time:180000,errors:['time']})
            .then(time=>{
                let raw = time.first().content.split('/')
                let ft = raw.reverse().join('-')
                let checkingDate = new Date(ft)
                var currentDay = new Date()
                var isPast=false;
//function to check if date is older than current date
                function checkpast(date){
                    if(date.getUTCFullYear()<=currentDay.getUTCFullYear()){
                        if(date.getUTCMonth()<=currentDay.getUTCMonth()){
                            if(date.getUTCDate()<currentDay.getUTCDate()){
                                return isPast = true
                            }
                        }
                    }
                    return isPast=false
                }

                checkpast(checkingDate)
                if(isPast){
                    message.author.send('You can\'t put in a date in the past! Please restart the process again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                    return
                }else{
                    
                    message.author.send('Okay, what time will it be? Please set it to 24HR format like "16:30".').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>
                    message.author.dmChannel.awaitMessages(ct,{max:1,time:180000,errors:['time']})
                    .then(ttime=>{
                   
                        let inputTime = ttime.first().content +':00'
                        function checktimepast(time){
                            let hours = Number(time.split(':')[0])
                            let mins = Number(time.split(':')[1])
                            if(hours<=currentDay.getUTCHours()){
                                if(mins<=currentDay.getUTCMinutes()){
                                    return isPast=true
                                }
                            }else{
                                return isPast=false
                            }
                        }
                        checktimepast(inputTime)
                       if(isPast){
                           message.author.send('You can\'t set a time in the past! Please restart the process.')
                           return 
                       }else{
                          let timeToPush = ft+' '+inputTime
                          
                          reminderData.push(timeToPush)
                          message.author.send('Please enter a short description of the reminder:').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                          .then(()=>message.author.dmChannel.awaitMessages(getInfo,{max:1,time:300000,errors:['time']})
                          .then(info=>{
                              let rdesc = info.first().content
                              reminderData.push(rdesc)
                              reminderData = reminderData.concat([`${message.guild.id}`,`${message.author.username}`])
                              
                              var insertr = `INSERT INTO reminderlist(reminder_name,reminder_time,reminder_info,server,reminder_by) VALUES ?`
                             con.query(insertr,[[reminderData]],function(err,result){
                                 if(err){
                                     message.author.send('An error occurred. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                 };
                                 message.author.send('You reminder has been set successfully!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))   
                                 var timeIden = reminderData[1] 
                                 var reminderMe = new Discord.MessageEmbed()
                                 .setColor('#ffcc00')
                                 .setTitle('REMINDER SET: '+ reminderData[0])
                                 .setDescription(new Date(reminderData[1]).toUTCString())
                                 .addField('Reminder details:',reminderData[2])
                                 .setFooter(`Reminder made by ${reminderData[4]}\nPress 🔍 to see the reminder time in your timezone.\nPress ⏰ to recieve a direct message reminder`)
  
                                 message.channel.send(reminderMe).then(o=>o.react('🔍')).then(m=>m.message.react('⏰').then(p=>{
                                    const collector = p.message.createReactionCollector(getRes);
                                    collector.on('collect', (reaction,u) => {
                                        
                                        if(reaction._emoji.name=='⏰'){
                                        con.query(`SELECT reminder_id FROM reminderlist WHERE reminder_name='${p.message.embeds[0].title.split('REMINDER SET: ')[1]}' AND server='${message.guild.id}' AND reminder_time='${timeIden}' `,function(err,result){
                                            if (err) throw err
                                            let msgid = result[0].reminder_id
                                        var addperson=`INSERT INTO toremind(reminderid,server_id,person_to_remind,person_id) VALUES('${msgid}','${message.guild.id}','${u.username}','${u.id}')`
                                            con.query(addperson,function(err,result){
                                                if(err){console.log(err)}
                                            })
                                        })
                                    }else if(reaction._emoji.name=='🔍'){
                                        const getState = (x)=>x.content
                                        u.send('What is your state?').catch(e=>e.httpStatus==403?message.channel.send(`<@${u.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                        .then(()=>u.dmChannel.awaitMessages(getState,{max:1,time:180000,errors:['time']})
                                        .then(state=>{
                                            var area = moment.tz.names().find(x=>x.split('/')[1].toLowerCase().includes(state.first().content.toLowerCase()))
                                            return u.send(`The reminder will be on ${moment().tz(area).format("dddd, MMMM Do YYYY [at] h:mm:ss a")}`).catch(e=>e.httpStatus==403?message.channel.send(`<@${u.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                        }).catch(e=>u.send('Sorry, I couldn\'t convert it to your timezone').catch(e=>e.httpStatus==403?message.channel.send(`<@${u.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
                                        ).catch(e=>console.log(e))
                                    }
                                    });
                                }
                                 ).catch(err=>console.log(err))
                                 ).catch(e=>console.log(e))

                         })

                          })
                          ).catch(err=>console.log(err))
                       }
                    }).catch(err=>console.log(err))

                    ).catch(err=>console.log(err))
                }
               // reminderData.push(ft)
                
                
            }).catch(err=>console.log(err))
            ).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
        ).catch(err=>console.log(err))
	},
};
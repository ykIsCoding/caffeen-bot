module.exports = {
    name: 'selectivedm',
    cname:'selectivedm',
    description: 'send DM to specific users',
    cd:900,
	execute(message,Discord,prefix) {
        const filter =(x) => x.content && !x.author.bot
        
        let users = ''
        let roles=''
        var rArr =[]
        var dmTitle;
        var msgContent='';
        message.mentions.users.map(x=>users+=`${x.username}\n`)
        message.mentions.roles.map(x=>{
            rArr.push(x.id)
            roles+=`${x.name}\n`
        })
       let y = message.guild.members.cache.filter(g=>g._roles.some(o=>rArr.some(u=>u===o)))
       var userArray = y.map(x=>x.user).concat(message.mentions.users.map(i=>i))
       var nuserArray = userArray.filter((x,i)=>userArray.indexOf(x)===i)
      
        message.author.send(`You will be sending a DM to: \n${users}\n${roles}`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        .then(()=>{
            message.author.send("What will the title of the message be?").catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            .then(()=>message.author.dmChannel.awaitMessages(filter,{max:1,time:180000,errors:['time']})
            .then(title=>{
                dmTitle = title.first().content
                const getChoice = x => x.content === `${prefix} addon` || x.content === `${prefix} send` 
                getContent()
                function getContent(){
                message.author.send('Please input the content of your message in one message:').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                .then(()=>message.author.dmChannel.awaitMessages(filter,{max:1,time:120000,errors:['time']})
                .then(content=>{
                    msgContent+=`${content.first().content}\n`
                    message.author.send(`To add in additional content, type '${prefix} addon'\nTo send batch DM, type '${prefix} send'`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                    .then(()=>message.author.dmChannel.awaitMessages(getChoice,{max:1,time:120000,errors:['time']})
                    .then(choice=>{
                        if(choice.first().content==`${prefix} addon`){
                            return getContent()
                        }
                        if(choice.first().content==`${prefix} send`){
                            let batchMsg = new Discord.MessageEmbed()
                            .setColor('#d66b00')
                            .setTitle(`Batch DM: ${dmTitle}`)
                            .setDescription(msgContent)
                            .setFooter(`From ${message.author.username}\nServer: ${message.guild.name}`)
                            .setTimestamp()
                            //continue here
                            var received =''
                            let nr=0
                            let m=0
                            nuserArray.map(x=>{
                                try{
                                    x.send(batchMsg).catch(e=>{
                                        nr+=1
                                        return message.author.send(`Your selective DM to ${x.username} was not sent due to an error`)
                                    }).finally(()=>{
                                        received+=`${x.username}\n`
                                        return m+=1
                                    })
                                   // received+=`${x.username}\n`
                                }catch(e){
                                    message.author.send(`Your selective DM to ${x.username} was not sent due to an error`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                }
                                
                            })
                                  
                        }
                    }).catch(e=>console.log(e))
                    ).catch(e=>console.log(e))
                }).catch(e=>message.author.send('An error occurred. Please restart the process.')).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                ).catch(e=>message.author.send('An error occurred. Please restart the process.')).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                }
                

            }).catch(e=>message.author.send('An error occurred. Please restart the process.')).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            ).catch(e=>message.author.send('An error occurred. Please restart the process.')).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        }).catch(e=>message.author.send('An error occurred. Please restart the process.')).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        
        
	},
};
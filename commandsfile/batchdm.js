const timepack = require('countries-and-timezones');

module.exports = {
    name: 'batchdm',
    cname:'batchdm',
    description: 'send batch DM to users',
    cd:900,
	execute(message,Discord,prefix) {
        try{
        const filter =(x) => x.content && !x.author.bot
        let users = ''
        var dmTitle;
        var msgContent='';
        message.mentions.users.map(x=>users+=`${x.username}\n`)
        message.author.send(`You will be sending a batch DM to: \n${users}`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
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
                            let received =''
                            message.mentions.users.map(x=>{
                                try{
                                    var currentDoing = message.guild.presences.cache.find(y=>y.userID===x.id).activities[0]
                                    var userArea = message.guild.presences.cache.find(y=>y.userID===x.id).region
                                    if(currentDoing===undefined){
                                        x.send(batchMsg).catch(e=>message.author.send(`Your batch DM to ${x.username} was not sent due to an error`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))).finally(()=>received+=`${x.username}\n`)
                                    }else{
                                        x.send(`Sorry to disturb you while you\'re busy with ${currentDoing.name} 🙂. You have a message!`).catch(e=>console.log(e))
                                        x.send(batchMsg).catch(e=>message.author.send(`Your batch DM to ${x.username} was not sent due to an error`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))).finally(()=>received+=`${x.username}\n`)
                                    }
                                    
                                }catch(e){
                                    message.author.send(`Your batch DM to ${x.username} was not sent due to an error`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                }
                            }) 
                            if(received.match(/\w\d\W/gi)){
                                message.author.send(`Your batch DM has been sent successfully to:\n${received}`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                            }
                        }
                    })
                    ).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
                }).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
                ).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
                }
                

            }).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
            ).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
        }).catch(e=>message.author.send('An error occurred. Please restart the process.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
        
    }catch(e){
        message.author.send('An error occurred. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
    }
	},
};
module.exports = {
    name: 'delete interview',
    cname:'dinterview',
    description: 'deleting an interview',
    cd:5,
	execute(message,Discord,con,prefix) {
        try{
        con.query(`SELECT * FROM interviews WHERE interview_server_id=${message.guild.id}`,function(err,res){
            if (err){
                console.log(err)
                message.author.send('There was an error. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            }
            var titles=''
            res.map(x=>titles+=`${x.interview_id}) ${x.interview_name}\n`)
            let interviewsEmbed = new Discord.MessageEmbed()
            .setTitle('All Interviews')
            .setDescription(titles==''?'There are no interviews':titles)
            .setFooter('Please enter the number(s) corresponding to the interviews that you wish to delete, separating multiple numbers by a space (if applicable).')
            const getDel = x=>x.content
            message.author.send(interviewsEmbed).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>message.author.dmChannel.awaitMessages(getDel,{max:1,time:300000,errors:['time']})
            .then(ans=>{
              
                let collected = ans.first().content.split(' ')
                collected.map(interviewg=>{
                    con.query(`DELETE FROM interviews WHERE interview_id='${interviewg}'`,function(err,res){
                        if(err){
                            message.author.send('There was an error. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                            console.log(err)
                        }
                    })
                })
                con.query(`SELECT * FROM interviews WHERE interview_server_id='${message.guild.id}'`,function(err,res){
                    if(err){
                        message.author.send('There was an error. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                        console.log(err)
                    }
                    var ftitle=''
                    res.map(x=>ftitle+=`${x.interview_id}) ${x.interview_name}\n`)
                    let finterviewsEmbed = new Discord.MessageEmbed()
                    .setTitle('All Interviews')
                    .setDescription(ftitle==''?'There are no interviews':ftitle)
                    .setTimestamp()
                    message.author.send('Done! Here is the updated interview list.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                   message.author.send(finterviewsEmbed).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                })
            }).catch(e=>{
                message.author.send('Process aborted as there was no valid input.')}).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            ).catch(e=>{
                message.author.send('Process aborted as there was no valid input.')}).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))

        })
    }catch(e){
        console.log(e)
    }
	},
};
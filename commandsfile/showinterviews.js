module.exports = {
    name: 'showinterviews',
    cname:'sinterview',
    description: 'show all stored interviews',
    cd:5,
	execute(message,Discord,con,prefix) {
        try{
            var getInterviewsFromDB = `SELECT interview_qn_id,interview_qn_name, COUNT(interview_qn) AS num_of_qns FROM interview_qns WHERE interview_qn_server_id=${message.guild.id} GROUP BY interview_qn_name`
            con.query(getInterviewsFromDB,function(err,res){
                if(err) throw err
                console.log(res)    
                let interviewObject =''
                res.map(x=>{
                    interviewObject = interviewObject.concat(`Name: ${x.interview_qn_name}\nNo. of Qns:${x.num_of_qns}\nInterview ID:${x.interview_qn_id}\n`)
                })
                let interviewList = new Discord.MessageEmbed()
                                    .setColor('#a67041')
                                    .setDescription(interviewObject)
                                    .setFooter(`Type ${prefix} info <INSERT INTERVIEW ID HERE> in our DM chat for more info!`)
                const getAns = x =>{
                if(x.content.startsWith(`${prefix} info`)){
                        let a = x.content.split(' ')
                        if(a[2]==undefined){
                            message.author.send('You need to input the interview ID. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                        }else{
                            return x
                        }
                    }
                }
                message.author.send(interviewList).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>triggerInfo()).catch(e=>console.log(e))
                function triggerInfo(){
                    message.author.dmChannel.awaitMessages(getAns,{max:1,time:100000,errors:['time']})
                    .then(ans=>{
                        let y = ans.first().content.split(' ')
                        con.query(`SELECT * FROM interview_qns WHERE interview_qn_id=${y[2]} AND interview_qn_server_id=${message.guild.id}`,function(err,res){
                            if(err){
                                throw err
                            }
                            let allqns='';
                            let title = res[0].interview_qn_name
                            res.map(x=>allqns+=`${x.interview_qn_order}) ${x.interview_qn}\n`)
                            let infoOfInterview = new Discord.MessageEmbed()
                                                    .setColor('#734c29')
                                                    .setTitle(`Questions in ${title}`)
                                                    .setDescription(`${allqns}`)
                                                    
                        message.author.send(infoOfInterview).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                        })
                    }
                    ).catch(e=>{
                        console.log(e)
                        message.author.send('An error occurred. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))})

                }
            })

      }catch(e){
        message.channel.send('There was an error. Please try again.')
      }
    },

};
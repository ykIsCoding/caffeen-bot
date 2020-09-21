module.exports = {
    name: 'interview',
    cname:'interview',
    description: 'interviewing people',
    cd:10,
	execute(message,Discord,prefix,interviewResponses,con,interviewId) {
        if( interviewResponses.get(interviewId)==undefined){
            interviewResponses.set(interviewId,new Discord.Collection())
            interviewProcess()
            
        }else{
            return interviewProcess()
        }
        function interviewProcess(){
            
        message.mentions.users.map((person)=>{
            var personsResponse = new Discord.Collection()
            var z = message.mentions.users.array().indexOf(person)
          
            con.query(`SELECT * FROM interview_qns WHERE interview_qn_id=${interviewId} AND interview_qn_server_id=${message.guild.id}`,function(err,res){
                
                if(err){
                    console.log(err)
                    message.channel.send('Please input the correct data!')
                    return
                }
                if(res.length!==0){

                
                var qnArray =[]
                
                var interviewName = res[0].interview_qn_name
                async function makeQnArray(){
                res.map(x=>qnArray.push(x.interview_qn))
                await qnArray;
                
                var num =0
                     function sendGetRes(num,p){
                        const filter =(x) => x.content
                        p.send(qnArray[num]).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop ${p.username} a DM, please check that he/she has enabled DMs from server members/bots`):console.log(e)).then(()=>p.dmChannel.awaitMessages(filter,{max:1,time:300000,errors:['time']})
                        .then(response=>{
                            personsResponse.set(num,{question: qnArray[num] ,response:`${response.first().content}`})
                            if(num<qnArray.length-1){
                                num+=1
                                return sendGetRes(num,p)
                            }else{
                                p.send('That\'s all!')
                                
                                interviewResponses.get(interviewId).set(p.id,personsResponse)
                                var ans =''  
                                
                               
                                interviewResponses.get(interviewId).get(p.id).map(d=>ans+=`${d.question}\nResponse: ${d.response}\n\n`)
                                //.map(d=>ans+=`${d.question}\nResponse:${d.response}`)
                                let interviewFeedback = new Discord.MessageEmbed()
                                .setTitle(`Interview Responses from ${p.username}`) 
                                .addField('Interview Name:',interviewName)
                                .setDescription(ans) 
                                .setTimestamp()
                           
                                message.author.send(interviewFeedback).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
                                if(z==message.mentions.users.array().length-1){
                                    interviewResponses.delete(interviewId)
                    
                                }
                               
                            }
                        }).catch(e=>console.log(e))
                        ).catch(e=>console.log(e))
                    }
                    sendGetRes(num,person)
                }
                makeQnArray()
               
                //.then(()=>interviewResponses.delete(interviewId))   
            }else{
                return message.channel.send('Please check that the interviewID is valid and try again.')
            } 
            })
          
        
        })
    }

        
	},
}; 
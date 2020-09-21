

module.exports = {
	name: 'setinterview',
	cname:'minterview',
	description: 'Make an interview',
	cd:3,
	execute(message,con,prefix,Discord) {
		try{
		const filter =(x) => x.content && !x.author.bot
		var realTitle
		var guild_id = message.guild.id
		var interviewInfo ={
			question:{}
		}
		var qc =0
		function qnt(num){
			message.author.send('What will the question be?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
			.then(()=>message.author.dmChannel.awaitMessages(x=>x,{max:1,time:180000,errors:['time']})
			.then(qn=>{
				interviewInfo.question[num]=qn.first().content
				message.author.send('Question saved!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
				optionsPanel(num)
			}).catch(e=>message.author.send('An error occurred. Please restart process').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
			)
			.catch(e=>message.author.send('An error occurred. Please restart process').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
		}
		function optionsPanel(f){
			const getChosen = x => x.content===`${prefix} final` || x.content === `${prefix} addqn`
			message.author.send(`Okay, to add a question to ${realTitle}, type '${prefix} addqn'\nTo finalise interview type '${prefix} final' `).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
			.then(()=>message.author.dmChannel.awaitMessages(getChosen,{max:1,time:60000,errors:['time']})
			.then(chosen=>{
				function doFinal(){
					con.query(`INSERT INTO interviews(interview_name,interview_server_id) VALUES('${realTitle}','${guild_id}')`,function(err,res){
						if(err){
							console.log(err)
						}
						con.query(`SELECT * from interviews`,function(err,rest){
							if(err){
								console.log(err)
							}
							//see results 
							
							 var intid = rest.find(x=>x.interview_name===interviewInfo.iTitle && x.interview_server_id===guild_id).interview_id
							 var dataCollector =[]
							 Object.keys(interviewInfo.question).map(x=>{
								 dataCollector.push([
									 intid,
									 interviewInfo.question[x],
									 guild_id,
									 interviewInfo.iTitle
								 ])
							 })
							 con.query('INSERT INTO interview_qns(interview_qn_id,interview_qn,interview_qn_server_id,interview_qn_name) VALUES ?',[dataCollector],function(err,res){
							 if(err){
								 console.log(err)
							 }
							// console.log(res)
							message.author.send(`Okay, your interview has been set.`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
							var lst=''
							String(Object.values(interviewInfo.question).map((a)=>{
								lst+=`${a}\n`
							}))
							
							let summary = new Discord.MessageEmbed()
											.setColor('#00d891')
											.setTitle(`INTERVIEW: ${realTitle}`)
											.setDescription(lst)
											.setFooter(`In your server, say ${prefix} interview ${intid} <TAG USERS TO INTERVIEW HERE>`)
							message.author.send(summary).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
							 })
						})
					})
				}
	
				if(chosen.first().content===`${prefix} final`){
								return doFinal()
				}else{
						con.query(`SELECT interview_qns_allowed FROM addedservers WHERE server_id='${guild_id}'`,function(err,res){
							if(err){
								console.log(err)
							}
							if(Object.keys(interviewInfo.question).length==res[0].interview_qns_allowed){
								message.author.send('Sorry, you have already hit the maximum of 5 questions per interview. Your interview has been automatically saved.')
								return doFinal()
							}else{
								f+=1
					            return qnt(f)
							}
						})	
				}
			}).catch(e=>{
			return console.log(e)
			})
			).catch(e=>message.author.send('An error occurred. Please restart process').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
			}
		
		message.channel.send('Sure, check your DMs!')
		message.author.send('What do you want to name your interview as?').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)).then(()=>
		message.author.dmChannel.awaitMessages(filter,{max:1,time:180000,errors:['time']})
		.then(title=>{
			realTitle = title.first().content
			interviewInfo.iTitle = realTitle
			optionsPanel(qc)
		}).catch(e=>message.author.send('An error occurred. Please restart process').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))

		).catch(e=>message.author.send('An error occurred. Please restart process').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e)))
	
	//qnt()
//console.log(interviewInfo)
	}catch(e){
		message.author.send('An error occurred. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
	}
	},

};
const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
	name: 'concludevote',
	execute(votes,Discord,k,client) {
       let dv= votes.find(x=>x.sn==k)
       let NumberOfVotes = dv.voters.length
      // console.log( client.guilds.cache.find(x=>x.id===dv.serverID).members.cache)
       let totalServerMembers = client.guilds.cache.find(x=>x.id===dv.serverID).members.cache.filter(x=>!x.user.bot).array().length
       let invalidVotes = totalServerMembers - NumberOfVotes
       let choicesData=[] 
       function sorter(x){
              return x.count 
       } 
       dv.choices.array().sort((a,b)=>sorter(b)-sorter(a)).map(x=>{
              let supported = Number(x.count)
              let supportedPercentage = NumberOfVotes==0?Number(0).toFixed(2):((Number(supported)/Number(NumberOfVotes))*100).toFixed(2)
console.log(supportedPercentage)
              choicesData.push(`\nVotes for ${x.name}: ${supported}\nVote Percentage: ${supportedPercentage}%`)
       })
       var desc;
       console.log(dv.choices.array())
       if(dv.choices.array().some(x=>x.count>0)){
              let maxcount=0; 
              let samecount=0
              dv.choices.array().map(x=>{
                     if(x.count===maxcount && x.count!==0){
                            samecount+=1
                     } 
                     else if(x.count>maxcount){
                            maxcount = x.count
                     }
                 
                     return samecount
              })
              console.log(samecount)
              if(samecount===0){
      let highest =  dv.choices.array().sort((a,b)=>sorter(b)-sorter(a))[0]
       desc = `${highest.name} has the most vote(s) of ${highest.count}
      \nOf the total ${totalServerMembers} member(s) in this server, there were ${NumberOfVotes} valid vote(s) and ${invalidVotes} blank/invalid vote(s)`
       }else{
              desc = `The vote result is inconclusive. Multiple options garnered equal votes.
              \nOf the total ${totalServerMembers} member(s) in this server, there were ${NumberOfVotes} valid vote(s) and ${invalidVotes} blank/invalid vote(s)
              \nOrganising the vote again is highly recommended.`
       }
}else{
       desc = `The vote is result inconclusive. All votes were invalid/blank votes.
              \nOf the total ${totalServerMembers} members in this server, there were ${NumberOfVotes} valid vote(s) and ${invalidVotes} blank/invalid vote(s)
              \nOrganising the vote again is highly recommended.`
}
       
       let finalRes = new Discord.MessageEmbed()
       .setColor('#f3c623')
       .setTitle(dv.title)
       .addField('Summary:',desc)
       .addField('DATA OF OPTIONS',choicesData)
       .setTimestamp()

   
       client.guilds.cache.find(x=>x.id===dv.serverID).channels.cache.find(x=>x.id===dv.channelID).send(finalRes)
       //client.guilds.cache.find(x=>x.id===dv.serverID).send()
}
}
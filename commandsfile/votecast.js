const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'votecast',
    cname:'vote',
    description:'cast a vote',
    cd:3,
	execute(message,Discord,votes,voteiden) {
        
        var voteobj = votes.find(x=>x.sn==voteiden)
        if(voteobj==undefined){
            return message.channel.send('Please enter a valid vote id!')
        }
        if(voteobj.voters!==[]){
        if(voteobj.voters.some(x=>x===message.author.id)){
            return message.author.send('You have already voted!').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        }}
    
        if(voteobj!==undefined){
            var optionlist=[]
            voteobj.choices.map(x=>{
                optionlist.push(`\n${x.id} - ${x.name}`)
             })
            optionlist = 'OPTIONS (OPTION-CODE - OPTION NAME)'.concat(optionlist)
            const opt =(x)=>x.author.id===message.author.id
            let votedet = new Discord.MessageEmbed()
            .setTitle(voteobj.title)
            .setDescription(optionlist)
            .setFooter(`${message.author.username}, please enter the option code corresponding to your choice`)

            message.author.send(votedet).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            .then(()=>message.author.dmChannel.awaitMessages(opt,{max:1,time:300000,errors:['time']})
             .then(o=>{
                 let chosen = o.first().content
                 var t =voteobj.choices.find(x=>x.id==chosen)
                 t.count+=1
                 voteobj.voters.push(message.author.id)
                 message.author.send(`Your vote has been submitted successfully! You voted for ${t.name}.`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
             }).catch(e=>console.log(e))
            )
            .catch(e=>console.log(e))
            
        }else{
            message.author.send('sorry, there is no such vote being held.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        }

}
}
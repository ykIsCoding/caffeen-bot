const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'showreferendums',
    cname:'srefs',
    description:'show all ongoing referendums',
    cd:3,
	execute(message,Discord,votes,prefix) {
        try{
            message.channel.send(`<@${message.author.id}>, I will drop you a DM!`).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
            var details='(Serial-Number) - (Referendum Name)\n'
            votes.map(x=>details+=`${x.sn} - ${x.title}\n`)
            var dMsg = new Discord.MessageEmbed()
            .setTitle('List of ongoing referendums')
            .setDescription(details)
            .setFooter(`Type ${prefix} vote <INSERT SERIAL NUMBER HERE> in the server to vote!`)
            message.author.send(dMsg).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))

        }catch(e){
            message.channel.send('There was an error. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        }
       
}
}
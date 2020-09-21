module.exports = {
    name: 'server',
    cname:'server',
    description: 'server report',
    cd:3,
	execute(message,Discord,con,prefix,joined,left,banned,unbanned,invitesMade) {
       // message.guild.members.fetch().then((x)=>console.log(x))
       var totalMembers = message.guild.members.cache.array().length
       var botIdArray = message.guild.members.cache.filter(x=>x.user.bot).map(x=>x.user.id)
        var NumMembers = message.guild.members.cache.filter(x=>!x.user.bot).array().length
        var NumBots =  message.guild.members.cache.filter(x=>x.user.bot).array().length
        var onlineUsersArray = message.guild.presences.cache.filter(x=>x.status=='online' && !botIdArray.some(p=>p===x.userID)).map(x=>x.userID)
        var onlineBotsArray = message.guild.presences.cache.filter(x=>x.status=='online' && botIdArray.some(p=>p===x.userID)).map(x=>x.userID)
        var dndUsersArray = message.guild.presences.cache.filter(x=>x.status=='dnd' && !botIdArray.some(p=>p===x.userID)).map(x=>x.userID)
        var idleUsersArray = message.guild.presences.cache.filter(x=>x.status.toLowerCase()=='idle' && !botIdArray.some(p=>p===x.userID)).map(x=>x.userID)

        var numJoined = joined.array().length
        var numLeft = left.array().length
        var numBanned = banned.array().length
        var numUnbanned = unbanned.array().length
        var numInvites = invitesMade.array().length
        let serverReport = new Discord.MessageEmbed()
                            .setTitle('SERVER REPORT')
                            .addField('Total users in server:',totalMembers,true)
                            .addField('Total human users:',NumMembers,true)
                            .addField('Total bots:',NumBots,true)
                            .addField('Current Online:',onlineUsersArray.length,true)
                            .addField('Current Do-Not-Disturb users:',dndUsersArray.length,true)
                            .addField('Current Idle users:',idleUsersArray.length,true)
                            .addField('Total offline users:',NumMembers-onlineUsersArray.length,true)
                            .addField('Total offline bots:',NumBots-onlineBotsArray.length,true)
                            .addField('Total number of members who joined the server today (as of now):',numJoined)
                            .addField('Total number of members who left the server today (as of now):',numLeft)
                            .addField('Total number of members who were banned today (as of now):',numBanned)
                            .addField('Total number of members who were unbanned today (as of now):',numUnbanned)
                            .addField('Total number of server invites made today (as of now):',numInvites)
                            .setFooter('Total number of members who left includes those who were banned.')
                            .setTimestamp()
    message.channel.send(serverReport)

	},
};
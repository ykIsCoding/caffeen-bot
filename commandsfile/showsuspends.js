
module.exports = {
    name: 'showsuspends',
    cname:'ssuspends',
    description: 'show people suspended',
    cd:3,
	execute(message,con,getNameById,Discord) {
        var getSl = `SELECT suspended_user FROM suspendedt WHERE server=${message.guild.id}`
        con.query(getSl,function(err,result){
            if (err) throw err;
            var sp =  result.map((x,i)=>
            `${i+1}) ` + String(getNameById(x.suspended_user))+'\n').join('')
            var sl = new Discord.MessageEmbed()
            .setTitle(`The suspended users in ${message.guild.name} are:`).setDescription(sp)
            message.author.send(sl).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        })
        
        
	},
};
module.exports = {
	name: 'help',
	description: 'Details of all commands',
	cd:3,
	execute(Discord,message,client) {
        const attachment = new Discord.MessageAttachment('./caffeenmanual.pdf', 'caffeenmanual.pdf');

        message.channel.send(`<@${message.author.id}> I will drop you a DM!`)
        //.attachFiles(attachment)
        var tempHolder=[]
        let helpmsg='The following are the commands to use me:\n'
      //helpmsg+=`${x.cname} - ${x.description}\n`
        client.commands.map(x=>{
            if((x.description!=undefined && x.cname!=undefined )){
                tempHolder.push(`${x.cname} - ${x.description}\n`)
            }
        })
        tempHolder.sort().map(x=>helpmsg+=x)
        async function getc(){
            var info = await helpmsg
            let final = new Discord.MessageEmbed()
            .setTitle('Commands Reference')
            .setColor('green')
            .setDescription(info)
            .addField('Online Manual','https://www.codeencreateen.space/works-discordbots-caffeen-manual')
            .addField('Stay Connected','Instagram: https://www.instagram.com/codeencreateen/ \n Website: https://www.codeencreateen.space/')
            .attachFiles(attachment)
            //.setImage('attachment://caffeenmanual.pdf')
            .setFooter('For details on how to use each command, kindly refer to the attached manual or click on the link provided:)')
            message.author.send(final).catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
        }
        getc()
	},
};
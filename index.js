const Discord = require("discord.js");
const fs= require('fs')
var schedule = require('node-schedule');
const { prefix, token } = require("./config.json");
const client = new Discord.Client();
client.commands = new Discord.Collection();
const left = new Discord.Collection();
const joined = new Discord.Collection();
const banned = new Discord.Collection();
const unbanned = new Discord.Collection();
const invitesMade = new Discord.Collection()
const interviewResponses = new Discord.Collection()
const voteperiod = new Discord.Collection()
const votes = new Discord.Collection()
const teams = new Discord.Collection()
const cooldown = new Discord.Collection()

const commandFiles = fs.readdirSync('./commandsfile').filter(file => file.endsWith('.js'));
var carr =[]
for (const doc of commandFiles) {
	const command = require(`./commandsfile/${doc}`);
    client.commands.set(command.name, command);
    carr.push(`${prefix} ${command.cname}`)
//here
}



var mysql = require('mysql');


var con;
function ifDisconnect() {
    con = mysql.createConnection({
        host:'',
        user: "",
        password:'',
        database:'',
        port:''
    });
  
    con.connect(function(err) {
      if (err){
        setTimeout(ifDisconnect, 2000); 
      }
      console.log('connected')
    });
    con.on('error', function(err) {
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        ifDisconnect();                       
      } else {                                     
        console.log(err);                                 
      }
    });
  }
  ifDisconnect()



client.on('guildMemberRemove',x=>{
    left.set(x.user.id,x)
})

client.on('guildMemberAdd',x=>{
    joined.set(x.user.id,x)
})

client.on('guildBanRemove',(g,u)=>{
    console.log(u)
    unbanned.set(u.id,u)
})

client.on('guildBanAdd',(g,u)=>{
    banned.set(u.id,u)
})

client.on('inviteCreate',(u)=>{
    invitesMade.set(u.inviter.id,u)
})

client.on('guildDelete',(g)=>{
    con.query(`DELETE FROM addedservers WHERE server_id='${g.id}'`,function(e,r){
        if(e){
            console.log(e)
        }
    })
})



client.once('ready',()=>{
    client.user.setPresence({
		status:'online',
		activity:{
			name:`${prefix} help`,
			type:'LISTENING'
		}
	})
    
        var getDB = 'USE suspended'
        var makeSuspendList=`CREATE TABLE IF NOT EXISTS suspendedt(
            suspended_user VARCHAR(255) NOT NULL,
            server VARCHAR(255) NOT NULL,
            PRIMARY KEY (suspended_user,server)
        );`
        var makeReminder=`CREATE TABLE IF NOT EXISTS reminderlist(
            reminder_id INT NOT NULL AUTO_INCREMENT,
            reminder_name VARCHAR(255) NOT NULL,
            server VARCHAR(255) NOT NULL,
            reminder_info VARCHAR(255) NOT NULL,
            reminder_by VARCHAR(255) NOT NULL,
            reminder_time TIMESTAMP NOT NULL DEFAULT NOW(),
            PRIMARY KEY(reminder_id)
            );`

        var personalReminder = `CREATE TABLE IF NOT EXISTS toremind(
            reminderid INT NOT NULL,
            server_id VARCHAR(255) NOT NULL,
            person_to_remind VARCHAR(255) NOT NULL,
            person_id VARCHAR(255) NOT NULL,
            PRIMARY KEY(person_id,reminderid),
            FOREIGN KEY(reminderid) REFERENCES reminderlist(reminder_id) ON DELETE CASCADE
        );`
        var makeInterviewTable = `CREATE TABLE IF NOT EXISTS interviews(
            interview_id INT AUTO_INCREMENT,
            interview_name VARCHAR(255) NOT NULL,
            interview_server_id VARCHAR(255) NOT NULL,
            PRIMARY KEY (interview_id,interview_server_id)
        )`
        con.query(makeInterviewTable, function (err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('interview list created!')
            }
          }); 

          var makeServerTable = `CREATE TABLE IF NOT EXISTS addedservers(
              server_id VARCHAR(250) PRIMARY KEY,
              allowed_rows INT DEFAULT 10, 
              interview_qns_allowed INT DEFAULT 5
          )`

          con.query(makeServerTable, function (err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('server list created!')
            }
          }); 
client.on('guildCreate',(g)=>{
    con.query(`INSERT IGNORE INTO addedservers(server_id) VALUES('${g.id}')`,function(e,r){
        if(e){
            console.log(e)
        }
    })
})
         
        
        var makeInterviewQuestions = `CREATE TABLE IF NOT EXISTS interview_qns(
            interview_qn_order INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            interview_qn_id INT NOT NULL,
            interview_qn TEXT NOT NULL, 
            interview_qn_name VARCHAR(255) NOT NULL,
            interview_qn_server_id VARCHAR(255) NOT NULL
        )`
        con.query(makeInterviewQuestions, function (err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('interview qn list created!')
            }
          }); 

        var clear = 'Drop table reminderlist'
        var cr = 'drop table toremind'
        con.query(makeSuspendList, function (err, result) {
            if(err){
                con.query(getDB, function (err, result) {
                    console.log('suspendedlist ready!')
                  });
            }else{
                console.log('suspendedlist created!')
            }
          });   

          con.query(makeReminder, function (err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('reminder list created!')
                detectReminders() 
                setInterval(detectReminders,60000)
            }
          });   

          con.query(personalReminder, function (err, result) {
            if(err){
                console.log(err)
            }else{
                console.log('Preminder list created!')
            }
          });   
          
         // var currtime = new Date();

        
          
      
function detectReminders(){
    var getRem = 'SELECT * FROM reminderlist ORDER BY reminder_time'
    con.query(getRem,function(err,result){
        if(err){
          return console.log(err)
      }
       if(result!==undefined){
           if(result.length==0){
               return
           }
        result.map(x=>{
            if(x.reminder_time<=new Date()){
                var toGuildR = new Discord.MessageEmbed()
                .setColor('#cf1b1b') 
                .setTitle(`REMINDER: ${x.reminder_name}`)
            .setDescription(`${new Date(x.reminder_time).toUTCString()}`)
                .addField('Reminder details:',`${x.reminder_info}`)
                .setFooter(`Reminder made by ${x.reminder_by}`)

                client.guilds.cache.find(p=>p.id===x.server).channels.cache.find(x=>x.type==='text').send(toGuildR)
                con.query(`SELECT person_id FROM toremind where reminderid='${x.reminder_id}'`,function(err,result){
                   result.map(person=>{
                     toGuildR.title = `DIRECT MESSAGE REMINDER: ${x.reminder_name}`
                        toGuildR.color = '#f9fcfb'
                        toGuildR.timestamp = new Date()
                        toGuildR.description = `${new Date(x.reminder_time).toUTCString()}`
                        toGuildR.footer = {text:`Reminder made by ${x.reminder_by}\nThis message was sent to you because you opted for a DM reminder.`}
                        client.guilds.cache.find(p=>p.id===x.server).members.cache.find(x=>x.user.id===person.person_id).send(`<@${person.person_id}>`).then(x=>
                            x.channel.recipient.send(toGuildR).catch(e=>console.log(e))
                            ).catch(e=>console.log(e))
                    })
                    con.query(`DELETE FROM reminderlist WHERE reminder_id='${x.reminder_id}'`,function(err,result){
                        if(err) throw err
                    })
                })  
                
            }
          })
        }
    
    })
}  

})


client.on('error',(x)=>console.log(x))

client.on('message',message=>{
    function SetCd(cname,ep,admin=true,dbtb=false,dbhead=false){
        if(!message.guild.members.cache.find(u=>u.user.id=='757256415831130153').hasPermission(['ADMINISTRATOR'])){
            return message.channel.send('Sorry, in order for me to function properly, I need to have administrator permissions.')
        }
        if(admin){
            if(dbtb && dbhead){
                con.query(`SELECT allowed_rows FROM addedservers WHERE server_id='${message.guild.id}'`,function(e,r){
                    if(e){
                        console.log(e)
                    }
                    console.log(r)
                    con.query(`SELECT COUNT(*) AS qty FROM ${dbtb} WHERE ${dbhead}='${message.guild.id}'`,function(err,res){
                        if(err){
                            console.log(err)
                        }
                        
                        if(res[0].qty==r[0].allowed_rows){
                            return message.channel.send('Sorry, this server has already reached its maximum quota for using this command.')
                        }
                        executeCommand()
                    })
                })
            }else{
                return executeCommand()
            }
            function executeCommand(){
           if(!message.guild.members.cache.get(message.author.id).hasPermission('ADMINISTRATOR')){
               return message.channel.send('Sorry, this command is only for admins!')
           }else{
                       
        var command = client.commands.get(`${cname}`)
        if (!cooldown.has(command.name)) {
            cooldown.set(command.name, new Discord.Collection());
        }
        const currently = Date.now();
    const ts = cooldown.get(command.name);
    const cdtime = (command.cd || 3) * 1000;
    
    if (ts.has(message.author.id)) {
        const et = ts.get(message.author.id) + cdtime;
    
        if (currently < et) {
            const waitTill = (et- currently) / 1000;
            return message.reply(`let me rest a bit...just another ${waitTill.toFixed(1)} second(s) before listening to the \`${command.name}\` command again.`);
        }
    }
    command.execute(...ep)
    ts.set(message.author.id, currently);
    setTimeout(() => ts.delete(message.author.id), cdtime);

           }
        }
        }else{
        
        var command = client.commands.get(`${cname}`)
        if (!cooldown.has(command.name)) {
            cooldown.set(command.name, new Discord.Collection());
        }
        const currently = Date.now();
    const ts = cooldown.get(command.name);
    const cdtime = (command.cd || 3) * 1000;
    
    if (ts.has(message.author.id)) {
        const et = ts.get(message.author.id) + cdtime;
    
        if (currently < et) {
            const waitTill = (et- currently) / 1000;
            return message.reply(`let me rest a bit...just another ${waitTill.toFixed(1)} second(s) before listening to the \`${command.name}\` command again.`);
        }
    }
    command.execute(...ep)
    ts.set(message.author.id, currently);
    setTimeout(() => ts.delete(message.author.id), cdtime);
}
    }
 // const guildId = message.guild.id
  //let userId =  message.author.id
  
if(message.guild){
try{
 var Okay;
  var approve = `SELECT EXISTS(SELECT * FROM suspendedt WHERE server='${message.guild.id}' AND suspended_user='${message.author.id}')`
  
//console.log(message.guild.presences.cache.map(x=>x.activities))
  con.query(approve,function (err, result) {
    if (err) throw err;
    if(message.author.bot) return
    if(message.content==='hi'){
        SetCd(message.content,[message])
    }

if(Object.values(result[0])[0]!==1){
  //  console.log(message.mentions)
    function getNameById(selectedUser){
     return message.member.guild.members.cache.find(x=>x.user.id===selectedUser).user.username
    }
    if(message.content.startsWith(`${prefix} suspend`)){

        message.delete()
        let suspendTobe = [] 
      message.mentions.users.map(t=>{
            if(t.bot){
                message.channel.send(`${t.username} is a bot.You can\'t suspend bots!`)
                return
           }else if(t.id===message.author.id){
               message.channel.send('you can\'t suspend yourself!')
                return 
            }else{
            suspendTobe.push([t.id,message.guild.id])
            }
        })
     let nameList =[]
     suspendTobe.map(x=>nameList.push(getNameById(x[0])))
     //   client.commands.get('suspend').execute(message,client,suspendTobe,con,nameList)
        SetCd('suspend',[message,client,suspendTobe,con,nameList],true,'suspendedt','server')
        //console.log(t)
     //   message.mentions.users.filter(p=>p.id!==message.author.id && !p.bot).map(individual=>suspendTobe.push([individual.id,message.guild.id]))
    
    }

    if(message.content.startsWith(`${prefix} unsuspend`)){
        message.delete()
        let UnsuspendTobe = []
        message.mentions.users.map(individual=>UnsuspendTobe.push([individual.id,message.guild.id]))
      //  client.commands.get('unsuspend').execute(message,client,UnsuspendTobe,con)
        SetCd('unsuspend',[message,client,UnsuspendTobe,con])
    }
    
    if(message.content.startsWith(`${prefix} mreminder`)){
        message.delete()
        //client.commands.get('reminder').execute(message,con,Discord)
        SetCd('reminder',[message,con,Discord],true,'reminderlist','server')
    }
    if(message.content.startsWith(`${prefix} help`)){
        message.delete()
        client.commands.get('help').execute(Discord,message,client)
    }

    if(message.content.startsWith(`${prefix} kick`)){
        message.delete()
        if(message.content.toLowerCase()==`${prefix} kick`){
            return message.channel.send('You have to tag the user you wish to kick.')
        }
      //  client.commands.get('kick').execute(message,Discord)
        SetCd('kick',[message,Discord])
    }

    
    if(message.content.startsWith(`${prefix} ban`)){
        message.delete()
        if(message.content.toLowerCase()==`${prefix} ban`){
            return message.channel.send('You have to tag the user you wish to ban.')
        }
       // client.commands.get('ban').execute(message,Discord)
        SetCd('ban',[message,Discord])
    }


    
    if(message.content.startsWith(`${prefix} ssuspends`)){
        message.delete()
        //client.commands.get('showsuspends').execute(message,con,getNameById,Discord)
        SetCd('showsuspends',[message,con,getNameById,Discord])
    }

    if(message.content.startsWith(`${prefix} minterview`)){
        message.delete()
       // client.commands.get('setinterview').execute(message,con,prefix,Discord)
        SetCd('setinterview',[message,con,prefix,Discord],true,'interviews','interview_server_id')
    }
    if(message.content===`${prefix} sinterview`){
        message.delete()
        var cmdKeyWord = 'showinterviews'
        SetCd(cmdKeyWord,[message,Discord,con,prefix])
      //  client.commands.get('showinterviews').execute(message,Discord,con,prefix)
    }

    if(message.content===`${prefix} dinterview`){
        message.delete()
       // client.commands.get('delete interview').execute(message,Discord,con,prefix)
        SetCd('delete interview',[message,Discord,con,prefix])
    }
    if(message.content.startsWith(`${prefix} vote`)){
        message.delete()
        var voteiden = message.content.split(' ')[2]
        if(voteiden==undefined){
            return message.channel.send('Please enter a valid vote ID together with the command.')
        }
        //client.commands.get('votecast').execute(message,Discord,votes,voteiden)
        SetCd('votecast',[message,Discord,votes,voteiden],false)
    }
    if(message.content.startsWith(`${prefix} holdref`)){
        message.delete()
      //  client.commands.get('vote').execute(message,prefix,Discord,votes,voteperiod,schedule,client)
      SetCd('votecast',[message,prefix,Discord,votes,voteperiod,schedule,client])
    }
 
    if(message.content===`${prefix} srefs`){
        message.delete()
       // client.commands.get('showreferendums').execute(message,Discord,votes,prefix)
        SetCd('showreferendums',[message,Discord,votes,prefix],false)
    }
    if(message.content===`${prefix} server`){
        message.delete()
       // client.commands.get('server').execute(message,Discord,con,prefix,joined,left,banned,unbanned,invitesMade)
        SetCd('server',[message,Discord,con,prefix,joined,left,banned,unbanned,invitesMade])
    }
    if(message.content.startsWith(`${prefix} team`)){
        message.delete()
        if(teams.some(x=>x.leader==message.author)){
            return message.channel.send('You are already looking for a team!')
        }
       // client.commands.get('findteam').execute(message,prefix,Discord,teams,schedule)
        SetCd('findteam',[message,prefix,Discord,teams,schedule],false)
    }
    if(message.content.startsWith(`${prefix} batchdm`)){

        if(message.mentions.users.array().length==0){
            message.delete()
           return message.channel.send('Please tag the people you are sending the message to in the command message!')
        }
        message.delete()
        message.channel.send(`<@${message.author.id}>, check your DMs!`)
      //  client.commands.get('batchdm').execute(message,Discord,prefix)
        SetCd('batchdm',[message,Discord,prefix])
    }

    if(message.content.startsWith(`${prefix} selectivedm`)){
        
        if(!message.mentions.users.array().length==0 || !message.mentions.roles.array().length==0){
            message.delete()
            message.channel.send(`<@${message.author.id}>, check your DMs!`)
           // client.commands.get('selectivedm').execute(message,Discord,prefix)
            SetCd('selectivedm',[message,Discord,prefix])
            return 
        }
        message.delete()
        return message.channel.send('Please tag the role/users you are sending the message to in the command message!')
    }

    if(message.content.startsWith(`${prefix} interview`)){
        message.delete()
        //?c interview interviewID mentions...
        var interviewId = message.content.split(' ')[2]
        if(!interviewId.match(/\d/gi)){
            return message.channel.send('Please put in the interview ID in the command message!')
        }
        if(message.mentions.users.array().length==0){
            message.delete()
           return message.channel.send('Please tag the people you are interviewing in the command message!')
        }
      //  client.commands.get('interview').execute(message,Discord,prefix,interviewResponses,con,interviewId)
        SetCd('interview',[message,Discord,prefix,interviewResponses,con,interviewId])
    }

  
 
}else if(carr.some(x=>x==message.content)){
    message.channel.send('Sorry, you are not allowed to do that!')
}

});

}catch(err){
    console.log(err)
    //message.guild.send('An error occurred. Please try again.')
    message.author.send('An error occurred. Please try again.').catch(e=>e.httpStatus==403?message.channel.send(`<@${message.author.id}> I could not drop you a DM, please check that you have enabled DMs from server members/bots`):console.log(e))
}
}
})


client.login(token);
module.exports = {
    name: 'unsuspend',
    cname:'unsuspend',
    description: 'Unsuspend user from using bot commands',
    cd:3,
    execute(message,client,UnsuspendTobe,con) {
        UnsuspendTobe.map(item=>{
            var check=`SELECT EXISTS(SELECT * FROM suspendedt where server='${message.guild.id}' AND suspended_user='${item[0]}' )`
        con.query(check,function(err,result){
            if(err){
                console.log(err)
            }
            if(Object.values(result[0])[0]===0){
                message.channel.send(`<@${item[0]}> is not suspended in the first place...`)
            }else{
                
                message.channel.send('done! I will listen to the mentioned users(s).')
                remover(item[0],item[1])
            }
        })

    })
        function remover(userToRemove,serverid){
            let handleUnsuspend = `DELETE FROM suspendedt WHERE server='${message.guild.id}' AND suspended_user='${userToRemove}'`
            con.query(handleUnsuspend, function (err, result) {
                if (err){
                    message.channel.send('An error occurred. Please try again')
                };
            })
        }
	},
};
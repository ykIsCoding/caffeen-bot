module.exports = {
    name: 'suspend',
    cname:'suspend',
    description: 'Suspend user from using bot commands',
    cd:3,
	execute(message,client,suspendTobe,con,nameList) {
        if(suspendTobe.length>0){
        let handleSuspend = `INSERT IGNORE INTO suspendedt(suspended_user,server) VALUES ?`
        con.query(handleSuspend,[suspendTobe], function (err, result) {
            if (err){
                message.channel.send('An error occurred. Please try again')
            };
            if(nameList.length===1){
            message.channel.send(`Done! I won\'t listen to ${nameList[0]}`) 
            }else if(nameList.length===2){
            message.channel.send(`Done! I won\'t listen to ${nameList[0]} and ${nameList[1]}`) 
            }else{
                let f;
                let last = nameList.pop()
                f=nameList.join(', ')
                f=f.concat(` and ${last}`)
                message.channel.send(`Done! I won't listen to ${f}`)
            }   
        })
    }else{
        return
    }
	},
};
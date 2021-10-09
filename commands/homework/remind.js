const fs = require('fs');
const Discord = require("discord.js")

module.exports = function (message)
{
    let dir = `./reminder_storage/${message.author.id}`;
    let fdir = fs.readdirSync(dir);
    let embed = new Discord.MessageEmbed().setColor("#FFFF00").setTitle("Reminder List");
    for(const file of fdir)
    {
        if(fs.statSync(dir).isDirectory())
        {
            let newdir = fs.readdirSync(dir+'/'+file)
            for(const f2 of newdir)
            {
                let data = fs.readFileSync(dir+'/'+file+'/'+f2,{encoding:'utf-8'});
                data = JSON.parse(data);
                time = f2.toString().replace("_",":").split(":")
                time[0] = time[0].length == 2 ? time[0]: "0"+time[0];
                time[1] = time[1].length == 2 ? time[1]: "0"+time[1];

                embed.addField(data.name,file.toString()+'\n'+time[0]+':'+time[1]
                +'\n'+data.type);
                continue;
            }
        }
        // embed.addField(file.substring(file.length-5,file.length-1))
        // console.log(file.toString().substring(file.length-5,file.length-1))
    }
    message.channel.send(embed);
}
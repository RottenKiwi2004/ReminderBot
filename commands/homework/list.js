const fs = require("fs");
const Discord = require("discord.js");
const checkLate = require("../../hidden_commands/checkLate");
const embedColor = "#fcdb03";
const lateColor = "#ff4a3d";
module.exports = function(message)
{   
    checkLate(message);
    // return;
    let id = message.author.id;
    let Author = message.author;
    let homeworkFiles = fs.readdirSync(`./homework_storage/${id}`);
    let embedList = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle("Homework List")
        .setAuthor(`${Author.username}#${Author.discriminator}`,Author.avatarURL())
        .setDescription(`@${Author.username}#${Author.discriminator}`)
        .setThumbnail(Author.avatarURL());
    let lateList = new Discord.MessageEmbed()
        .setColor(lateColor)
        .setTitle("Homework List (Late)")
        .setAuthor(`${Author.username}#${Author.discriminator}`,Author.avatarURL())
        .setDescription(`@${Author.username}#${Author.discriminator}`)
        .setThumbnail(Author.avatarURL());
    let late = false;
    for(const file of homeworkFiles)
    {
        
        
        if(fs.statSync(`./homework_storage/${Author.id}/${file}`).isDirectory())
        {
            let lateF = fs.readdirSync(`./homework_storage/${Author.id}/${file}`);
            for(const file2 of lateF)
            {
                let txt = fs.readFileSync(`./homework_storage/${Author.id}/${file}/${file2}`, 'utf8');
                txt = JSON.parse(txt);
                let due_date = new Date(txt.dueDate);
                lateList.addField(`__**${txt.name}**__`
                ,"Total time: "+txt.hour + " hours " + txt.minute + " minutes\n"
                + `Due date: ${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()}`
                +` ${due_date.getHours()>=10 ? ""+due_date.getHours() : "0"+due_date.getHours()}:${due_date.getMinutes()>=10 ? ""+due_date.getMinutes() : "0"+due_date.getMinutes()}`);
                late = true;
            }
        }
        else
        {
            let txt = fs.readFileSync(`./homework_storage/${Author.id}/${file}`, 'utf8');
            txt = JSON.parse(txt);
            let due_date = new Date(txt.dueDate);
            embedList.addField(`__**${txt.name}**__`
            ,"Total time: "+txt.hour + " hours " + txt.minute + " minutes\n"
            + `Due date: ${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()}`
            +` ${due_date.getHours()>=10 ? ""+due_date.getHours() : "0"+due_date.getHours()}:${due_date.getMinutes()>=10 ? ""+due_date.getMinutes() : "0"+due_date.getMinutes()}`);
        }
    }
    if(late) message.channel.send(lateList);
    message.channel.send(embedList);
}
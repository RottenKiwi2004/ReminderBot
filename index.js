const Discord = require('discord.js');
const bot = new Discord.Client();
const PREFIX = '/';
const fs = require('fs');
const users = {};
const checkRemind = require("./hidden_commands/checkRemind.js")
bot.commands = new Discord.Collection();
bot.restRequestTimeout = 60000;

const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bot running!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));



const command = {};
function DFSFiles(directory)
{
    const commandFiles = fs.readdirSync(directory);
    for(const file of commandFiles)
    {
        if(file.endsWith(".js"))
        {
            let command_name = file.toString().replace(".js","");
            command[command_name] = require(directory + file);
        }
        else if(!file.includes("."))
        {
            DFSFiles(directory+file+"/");
        }
    }
}
DFSFiles('./commands/');
console.log(command);






//Show servers bot running on
function showServers(value,key,map)
{
    console.log("-" + {value}.value.name);
}
function setStatus()
{
    let Time = new Date();
    let h1 = Math.floor(Time.getHours()/10);
    let h2 = Time.getHours()%10;
    let m1 = Math.floor(Time.getMinutes()/10);
    let m2 = Time.getMinutes()%10;
    let s1 = Math.floor(Time.getSeconds()/10);
    let s2 = Time.getSeconds()%10;
    if(Time.getSeconds()%60==0)
    {
        bot.user.setPresence({activity : {name: `/help at ${h1}${h2}:${m1}${m2}`}, status: "online"});
        try {
            checkRemind(users);
        }
        catch(e)
        {
            console.log(e);
        }
        // console.log(`at ${h1}${h2}:${m1}${m2}:${s1}${s2}`)
    }
}


const token = 'Token';
bot.login(token);


// When bot is ready, do this
bot.on('ready', () => 
{
    console.log('Online !');
    var running_on_servers = bot.guilds.cache.size;
    console.log("Running on",running_on_servers,"servers");
    bot.guilds.cache.forEach(showServers);
    setInterval(setStatus,1000);
})




// When bot recieve message, do this
bot.on('message', message=>
{
    if(/*message.author.bot ||*/ message.content[0] !== '/') return;
    args = message.content.substring(PREFIX.length).split(" ");
    users[message.author.id] = message.author;
    if(args[0]==="help")
    {
        let toSend = "**Command lists =>**\n"
        for(const prop in command) {if (command.hasOwnProperty(prop) && prop!="operation") toSend+=`> /${prop}\n`; console.log(prop)}
        message.channel.send(toSend);
        return;
    }
    else
    {
        try
        {
            command[args[0]](message);
        }
        catch(error)
        {
            message.channel.send(`An error occurred during command execution`);
        }
    }

    // try {bot.commands.get(args[0]).execute(message, args);}
    // catch(e){ console.log(e);message.channel.send(`There is no ${args[0]} command!`);}
})


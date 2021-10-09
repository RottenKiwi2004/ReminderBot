const fs = require("fs");
const Discord = require("discord.js");
const embedColor = "#fcdb03";
const genFree = require("../../hidden_commands/genFree.js");
let items = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function showFree(d,m,y,message)
{
    let folder = fs.readdirSync(`./freetime/${message.author.id}/${m} ${d}, ${y}`);
    let id = message.author.id;
    let Author = message.author;
    let i=1;
    let embedList = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(`Freetime on ${m} ${d}, ${y}`)
    .setAuthor(`${Author.username}#${Author.discriminator}`,Author.avatarURL())
    .setDescription(`@${Author.username}#${Author.discriminator}`)
    .setThumbnail(Author.avatarURL());
    for(const file of folder)
    {
        let txt = fs.readFileSync(`./freetime/${message.author.id}/${m} ${d}, ${y}/${file}`, `utf-8`);
        txt = JSON.parse(txt);
        let sth = txt.start.hour;
        let stm = txt.start.minute
        let fnh = txt.finish.hour;
        let fnm = txt.finish.minute
        embedList.addField(`__**Freetime #${i++}**__`,`Range: ${sth}:${stm}-${fnh>=10 ? fnh:'0'+fnh}:${fnm>=10?fnm:'0'+fnm}\n
        Total time: ${txt.time.hour} hour${txt.time.hour>1?"s":""} ${txt.time.minute} minute${txt.time.minute>1?"s":""}`);
    }
    message.channel.send(embedList);
}

module.exports = function (message)
{
    let dir = `./freetime/${message.author.id}`;
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
    let args = message.content.trim().substring(1).split(`"`);
    args = args.filter(function (el) {
        return el != " ";
    });
    args = args.filter(function (el) {
        return el != "";
    });
    if(!args[1])
    {
        let date = new Date();
        let m = items[date.getMonth()];
        let d = date.getDate();
        let y = date.getFullYear();
        dir+=`/${m} ${d}, ${y}`;
        genFree(d,m,y,message);
        showFree(d,m,y,message)
    }
    else
    {
        let date = args[1].split(" ");
        let d = date[1];
        d = d.substring(0, d.length - 1);
        let m = date[0];
        let y = date[2];
        genFree(d,m,y,message);
        showFree(d,m,y,message)
    }
    // console.log(args);
    
}
const Discord = require('discord.js')
const fs = require('fs');

const embedColor = "#fcdb03";
const genFree = require("../../hidden_commands/genFree.js");
const freetime = require("../../commands/homework/freetime.js");
let items = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function showFree(date,message)
{
    let folder = fs.readdirSync(`./freetime/${message.author.id}/${date}`);
    let id = message.author.id;
    let Author = message.author;
    let i=1;
    let embedList = new Discord.MessageEmbed()
    .setColor(embedColor)
    .setTitle(`Freetime on ${date}`)
    .setAuthor(`${Author.username}#${Author.discriminator}`,Author.avatarURL())
    .setDescription(`@${Author.username}#${Author.discriminator}`)
    .setThumbnail(Author.avatarURL());
    for(const file of folder)
    {
        let txt = fs.readFileSync(`./freetime/${message.author.id}/${date}/${file}`, `utf-8`);
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

function operation(message)
{
    let args = message.content.trim().substring(1).split(`"`);
    let temp1 = args[0].trim()
    let temp2 = args[args.length-1].trim()
    let temp3 = temp2.split(" ");
    let temp4 = [];
    temp4.unshift(temp1,args[1]);
    let final = temp4.concat(temp3);
    final = final.filter(function (el) {
        if(el) return el;
    });
    console.log(final);
    let ins = {}
    ins.date = final[1] == "default" ? false : final[1];
    ins.mode = final[2];
    ins.start = final[3];
    ins.time = parseFloat(final[4]);
    return ins;
}

module.exports = function (message) {
    let instruction = operation(message);
    if(instruction.start.includes("-") || instruction.time <=0 || instruction.time >=24)
    return message.channel.send("Date and Time must not be negative or more than 24");
    message.channel.send(items.indexOf(date))
    if(!instruction.date)
    {
        let dir = `./freetime/${message.author.id}`;
        if(instruction.mode == "add")
        {
            if (!fs.existsSync(dir))
            {
                fs.mkdirSync(dir);
            }
            dir+="/def"
            if (!fs.existsSync(dir))
            {
                fs.mkdirSync(dir);
            }
            textToWrite = {};
            textToWrite.start = {};
            textToWrite.start.hour = instruction.start.split(":")[0]
            textToWrite.start.minute = instruction.start.split(":")[1]
            textToWrite.time = {hour:Math.floor(instruction.time),minute:Math.round((instruction.time-Math.floor(instruction.time))*60)};
            textToWrite.finish = {};
            textToWrite.finish.hour = 0;
            textToWrite.finish.minute = parseInt(textToWrite.start.minute) + textToWrite.time.minute;
            textToWrite.finish.hour = parseInt(textToWrite.start.hour) + textToWrite.time.hour + (textToWrite.finish.minute >=60 ? 1 : 0);
            textToWrite.finish.minute = textToWrite.finish.minute >=60 ? textToWrite.finish.minute-60 : textToWrite.finish.minute;
            console.log(textToWrite)
            textToWrite = JSON.stringify(textToWrite);
            dir+=`/${instruction.start.replace(":","_")}.json`;
            fs.writeFileSync(dir,textToWrite);
        }
        else if (instruction.mode == "remove")
        {
            // let dir2 = fs.readdirSync(`${dir}`);
            // for(let file of dir2)
            // {
            //     console.log(file);
            // }
            fs.unlinkSync(`${dir}/def/${instruction.start.split(":")[0]}_${instruction.start.split(":")[1]}.json`)
        }
    }
    else
    {
        let dir = `./freetime/${message.author.id}`;
        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }
        dir+=`/${instruction.date}`;
        if (!fs.existsSync(dir))
        {
            fs.mkdirSync(dir);
        }
        if(instruction.mode == "add")
        {
            textToWrite = {};
            textToWrite.start = {};
            textToWrite.start.hour = instruction.start.split(":")[0]
            textToWrite.start.minute = instruction.start.split(":")[1]
            textToWrite.time = {hour:Math.floor(instruction.time),minute:Math.round((instruction.time-Math.floor(instruction.time))*60)};
            textToWrite.finish = {};
            textToWrite.finish.hour = 0;
            textToWrite.finish.minute = parseInt(textToWrite.start.minute) + textToWrite.time.minute;
            textToWrite.finish.hour = parseInt(textToWrite.start.hour) + textToWrite.time.hour + (textToWrite.finish.minute >=60 ? 1 : 0);
            textToWrite.finish.minute = textToWrite.finish.minute >=60 ? textToWrite.finish.minute-60 : textToWrite.finish.minute;
            console.log(textToWrite)
            textToWrite = JSON.stringify(textToWrite);
            dir+=`/${instruction.start.replace(":","_")}.json`;
            fs.writeFileSync(dir,textToWrite);
            showFree(instruction.date,message);
            
        }
        else if (instruction.mode == "remove")
        {
            // let dir2 = fs.readdirSync(`${dir}`);
            // for(let file of dir2)
            // {
            //     console.log(file);
            // }
            fs.unlinkSync(`${dir}/${instruction.start.split(":")[0]}_${instruction.start.split(":")[1]}.json`);
            showFree(instruction.date,message);
        }
    }
}
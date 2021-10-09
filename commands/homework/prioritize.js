const fs = require('fs');
const Discord = require("discord.js");
const totalFree = require('../../hidden_commands/totalFree');
const checkLate = require('../../hidden_commands/checkLate');
const createRemind = require('../../hidden_commands/createRemind');
let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

let allhw = [], totalTime = {};

let toSendToUser = [];

function compareTime(timeobj1, timeobj2)
{
    if(timeobj1.hour < timeobj2.hour)
    {
        return "smaller";
    }
    else
    {
        if(timeobj1.hour == timeobj2.hour)
        {
            return timeobj1.minutes > timeobj2.minutes ? "greater" : (timeobj1.minutes == timeobj2.minutes ? "equal" : "smaller")
        }
        else return "greater";
    }
}

function newEmbed(color,title,message)
{
    let embed = new Discord.MessageEmbed().setColor(color).setTitle(title).setFooter(`${message.author.username}#${message.author.discriminator}`);
    toSendToUser.push(embed);
}

function dfsFile(msg,dir,dir2)
{
    // let minDate = new Date(), maxDate = new Date();
    for(const file of dir2)
    {
        try{if(fs.statSync(dir+'/'+file).isDirectory())
        {
            let toSend1 = dir+'/'+file;
            let toSend2 = fs.readdirSync(toSend1);
            let x = dfsFile(msg,toSend1,toSend2);
            // minDate = minDate == undefined ? x.start : (minDate.getTime() >  x.start.getTime() ? x.start : minDate);
            // maxDate = maxDate == undefined ? x.stop : (maxDate.getTime() <  x.stop.getTime() ? x.stop : maxDate);
            continue;
        }}
        catch(e){continue;}
        res = fs.readFileSync(dir+'/'+file,'utf-8');
        allhw.unshift(dir+'/'+file);
        // let obj = JSON.parse(res);
        // let date = obj.dueDate;
        // totalTime.hour += obj.hour;
        // totalTime.minutes += obj.minute;
        // totalTime.hour += parseInt(obj.minute/60);
        // totalTime.minutes%=60;
        // date = new Date(date);
        // minDate = minDate == undefined ? date : (minDate.getTime() >  date.getTime() ? date : minDate);
        // maxDate = maxDate == undefined ? date : (maxDate.getTime() <  date.getTime() ? date : maxDate);
        // console.log("--------------")
    }
}

function getRange(message)
{
    let dir = `./homework_storage/${message.author.id}`;
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
    let dir2 = fs.readdirSync(dir);
    dfsFile(message,dir,dir2);
}

module.exports = function(message)
{
    checkLate(message);
    message.channel.send("Prioritizing your work. Please stand by.")
    try
    {
        allhw = [];
        getRange(message);
        toSendToUser = [];
        allhw.sort(function(a,b)
        {
            // console.log("Sorting")
            let due1 = fs.readFileSync(a,'utf-8');
            let due2 = fs.readFileSync(b,'utf-8');
            due1 = JSON.parse(due1);
            due2 = JSON.parse(due2);
            due1 = new Date(due1.dueDate);
            due2 = new Date(due2.dueDate);
            return due1.getTime() > due2.getTime() ? 1 : -1;
        });
        totalTime = {
            hour: 0,
            minutes: 0
        };
        let timeInRange;
        let minDate = new Date(), maxDate = new Date();
        let it = 1;
        let old_min = new Date(), old_max = new Date();
        for(let work of allhw)
        {
            work = fs.readFileSync(work,'utf-8');
            work = JSON.parse(work);
            newDue = new Date(work.dueDate)
            let h = newDue.getHours();
            let m = newDue.getMinutes();
            let displayDate = `${newDue.getDate()} ${month[newDue.getMonth()]}, ${newDue.getUTCFullYear()} ${h>=10?h:'0'+h}:${m>=10?m:'0'+m}`
            minDate = (minDate.getTime() >  newDue.getTime() ? newDue : minDate);
            maxDate = (maxDate.getTime() <  newDue.getTime() ? newDue : maxDate);
            if(!(old_max == maxDate) || !(old_min == minDate))
            {
                timeInRange = totalFree(message,minDate,maxDate);
                // console.log("New Range: ")
                // console.log(timeInRange);
            }
            totalTime.hour += work.hour;
            totalTime.minutes += work.minute;
            totalTime.hour += parseInt(totalTime.minutes/60);
            totalTime.minutes %= 60;

            let date = work.dueDate;
            // 1 week
            datew = new Date(date);
            datew = datew.getTime() - 7*24*60*60*1000;
            datew = new Date(datew);
            createRemind(datew, "1 week", work.name, message.author.id);
            // 15 min
            datem = new Date(date);
            datem = datem.getTime() - 15*60*1000;
            datem = new Date(datem);
            createRemind(datem, "15 min", work.name, message.author.id);
            // Due
            dated = new Date(date);
            dated = dated.getTime();
            dated = new Date(dated);
            createRemind(dated, "Due", work.name, message.author.id);
            // 100%
            dateh = new Date(date);
            dateh = dateh.getTime()-work.hour*60*60*1000-work.minute*60*1000;
            dateh = new Date(dateh);
            createRemind(dateh, "100% Left", work.name, message.author.id);



            let status = "Late";
            if((it>=10)&&it%10==1)newEmbed(status == "On time" ? "#22FF22" : "#FF2222", status,message);else
            try
            {
                if(compareTime(totalTime, timeInRange) == "greater" && toSendToUser[toSendToUser.length-1].color == 2293538)
                {
                    newEmbed("#FF2222","Late",message);
                    // console.log("New Embed: Late");
                }
                else if(compareTime(totalTime, timeInRange)=="smaller" || compareTime(totalTime, timeInRange)=="equal")
                {
                    status = "On time";
                    if(toSendToUser[toSendToUser.length-1].color != 2293538)
                    {
                        newEmbed("#22FF22","On time",message);
                        // console.log("New Embed: On Time");
                    }
                }
            }
            catch(error)
            {
                // console.log("New Embed: First");
                newEmbed(status == "On time" ? "#22FF22" : "#FF2222", status,message);
            }
            toSendToUser[toSendToUser.length-1].addField(`${it++}. ${work["name"]}`,
            displayDate+`${/*status=="Late"?*/`\n Need: ${work.hour}h ${work.minute}m\nTotal: ${totalTime.hour}h ${totalTime.minutes}m\nFree: ${timeInRange.hour}h ${timeInRange.minutes}m`/*:""*/}`);
        }
        for(const i of toSendToUser)
        {
            message.channel.send(i);
        }
    }
    catch(error)
    {
        console.log(error)
        // message.channel.send("The request took longer than 5 minutes. We will fix this problem soon");ณ
    }
    return;
}
const Discord = require('discord.js');
const bot = new Discord.Client();
const list = require('./list.js');
const fs = require('fs');

module.exports = function(message)
{
    
    let dir = fs.readdirSync(`./homework_storage/${message.author.id}`);
    for(const file of dir)
    {
        // param = file.toString().split(" ");
        // param = param.filter(function (el) {
        //     return el != " ";
        // });
        // let f = "";
        // for(let i=0;i<param.length;i++)
        // {
        //     f+=param[i];
        // }
        // fs.unlinkSync(`./homework_storage/${message.author.id}/${f}`);
        // console.log(`./homework_storage/${message.author.id}/${file.toString()}`);
        if(fs.statSync(`./homework_storage/${message.author.id}/${file.toString()}`).isDirectory())
        {
            let dir2 = fs.readdirSync(`./homework_storage/${message.author.id}/${file.toString()}`);
            for(const file2 of dir2)
            {
                fs.unlinkSync(`./homework_storage/${message.author.id}/${file.toString()}/${file2}`);
            }
            continue;
        }
        fs.unlinkSync(`./homework_storage/${message.author.id}/${file.toString()}`);
    }
    list(message);
}
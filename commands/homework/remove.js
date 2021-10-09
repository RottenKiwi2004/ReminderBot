const Discord = require('discord.js');
const bot = new Discord.Client();
const list = require('./list.js');
const fs = require('fs');

module.exports = function(message)
{
    let param = message.content.trim().substring(1).split(`"`);
    param = param.filter(function (el) {
        return el != " ";
    });
    param = param.filter(function (el) {
        return el != "";
    });
    try
    {
        fs.unlinkSync(`./homework_storage/${message.author.id}/${param[1]}.json`);
    }
    catch(error)
    {
        fs.unlinkSync(`./homework_storage/${message.author.id}/Late/${param[1]}.json`);
    }
    list(message);
}
const fs = require("fs");

function operation(message)
{
    let ins = {};
    let param = message.content.trim().substring(1).split("\"");
    param = param.filter(function (el) {
        return el != " ";
    });
    param = param.filter(function (el) {
        return el != "";
    });
    console.log(param)

    ins.title = param[1]
    ins.needed_time = {hour:Math.floor(parseFloat(param[2])),minute:Math.round((parseFloat(param[2])-Math.floor(parseFloat(param[2])))*60)};
    ins.due_date = new Date(param[3]);
    ins.directory = `./homework_storage/${message.author.id}`;
    return ins;
}

module.exports = function(message)
{
    let instructions = operation(message);
    // return;
    const title = instructions.title;
    const dir = instructions.directory;
    const due = instructions.due_date;
    const total_time = instructions.needed_time;

    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }

    // Write homework to file
    let textToWrite = "";
    textToWrite = {
        "name": title,
        "hour": total_time.hour,
        "minute": total_time.minute,
        "dueDate": due
    };
    textToWrite = JSON.stringify(textToWrite);
    fs.writeFileSync(dir+'/'+title+'.json',textToWrite);
    message.channel.send(`__**${title}**__\n`+"Total time: "+total_time.hour + " hours " + total_time.minute + " minutes\n"
    + `Due date: ${due.getDate()}/${due.getMonth()+1}/${due.getFullYear()}`
    +` ${due.getHours()>=10 ? ""+due.getHours() : "0"+due.getHours()}:${due.getMinutes()>=10 ? ""+due.getMinutes() : "0"+due.getMinutes()}`);
}
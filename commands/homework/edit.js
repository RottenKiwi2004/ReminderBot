const fs = require("fs");
module.exports = function(instructions,Channel)
{
    return;
    const title = instructions.title;
    const dir = instructions.directory;
    const due = instructions.due_date;
    const total_time = instructions.needed_time;
    const before = instructions.before;

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
    Channel.send(`__**Edited ${title}**__\n`
    +"Total time: "+before.hour + ` hour${before.hour > 1 ? 's':''} ` + before.minute + ` minute${before.minute > 1 ? 's':''} -> `
    + `${total_time.hour} hour${total_time.hour > 1 ? 's':''} ${total_time.minute} minute${total_time.minute > 1 ? 's':''}\n`
    + `Due date: ${due.getDate()}/${due.getMonth()+1}/${due.getFullYear()}`
    +` ${due.getHours()>=10 ? "" : "0"}${due.getHours()}:${due.getMinutes()>=10 ? "" : "0"}${due.getMinutes()}`);
}
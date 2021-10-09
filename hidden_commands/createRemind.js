const fs = require("fs");

let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

module.exports = function(date, type, name, id)
{
    dir = `./reminder_storage/${id}`
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
    let obj = {
        name: name,
        type : type,
    }
    dir = `./reminder_storage/${id}/${month[date.getMonth()]} ${date.getDate()}, ${date.getUTCFullYear()}`
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
    fs.writeFileSync(`./reminder_storage/${id}/${month[date.getMonth()]} ${date.getDate()}, ${date.getUTCFullYear()}/${date.getHours()}_${date.getMinutes()}`
    ,JSON.stringify(obj),{encoding: "utf-8"});
}
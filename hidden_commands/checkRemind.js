const fs = require("fs");
let month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
module.exports = function (users)
{
    let dir = fs.readdirSync("./reminder_storage");
    let d = new Date();
    for(const sub of dir)
    {
        let dir2 = fs.readdirSync("./reminder_storage/"+sub);
        if(fs.existsSync("./reminder_storage/"+sub+'/'+month[d.getMonth()]+' '+d.getDate()+', '+d.getUTCFullYear()))
        {
            if(fs.existsSync("./reminder_storage/"+sub+'/'+month[d.getMonth()]+' '+d.getDate()+', '+d.getUTCFullYear()+'/'+
            d.getHours()+'_'+d.getMinutes()))
            {
                let obj = fs.readFileSync("./reminder_storage/"+sub+'/'+month[d.getMonth()]+' '+d.getDate()+', '+d.getUTCFullYear()+'/'+
                d.getHours()+'_'+d.getMinutes());
                obj = JSON.parse(obj);
                users[sub].send(`**${obj.name}\n${obj.type}**`)
            }
        }
    }
}
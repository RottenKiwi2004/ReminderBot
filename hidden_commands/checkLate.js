const fs = require("fs");
module.exports = function(message)
{
    //
    let folder = fs.readdirSync(`./homework_storage/${message.author.id}`);
    for(const file of folder)
    {
        let f = fs.statSync(`./homework_storage/${message.author.id}/${file}`);
        if(f.isDirectory()) continue;
        else
        {
            let txt = fs.readFileSync(`./homework_storage/${message.author.id}/${file}`, 'utf8');
            txt = JSON.parse(txt);
            let due_date = new Date(txt.dueDate);
            let now = new Date();
            if(due_date < now)
            {
                if (!fs.existsSync(`./homework_storage/${message.author.id}/Late`))
                {
                    fs.mkdirSync(`./homework_storage/${message.author.id}/Late`);
                }
                fs.rename(`./homework_storage/${message.author.id}/${file}`,`./homework_storage/${message.author.id}/Late/${file}`,(err)=>{
                    if(err) throw err;
                })
            }
        }
    }
}
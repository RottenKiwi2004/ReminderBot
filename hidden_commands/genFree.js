const fs = require("fs");
module.exports = function(d,m,y,message)
{
    let dir = `./freetime/${message.author.id}/def/`;
    let dest = `./freetime/${message.author.id}/${m} ${d}, ${y}`;
    if(!fs.existsSync(dest))
    {
        fs.mkdirSync(dest,{recursive: true});
    }
    if(!fs.existsSync(dir))
    {
        fs.mkdirSync(dir,{recursive: true});
    }
    let folder = fs.readdirSync(dir);
    for(const file of folder)
    {
        fs.copyFileSync(dir+'/'+file,dest+'/'+file,fs.constants.COPYFILE_FICLONE);
    }
}
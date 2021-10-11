const fs = require('fs');
const Discord = require('discord.js');
const embedColor = "#6ab09a";
module.exports = 
{
    name: "homework",
    description: "All actions about your homework",
    execute(message,args)
    {
        switch(args[1].toLowerCase())
        {
            case "add" : 
            case "edit" :
            {
                
                if(!args[2]) return message.channel.send("Please provide the homework title");
                var dir = `./homework_storage/${message.author.id}`;

                // Check for new user and create new folder for them
                if (!fs.existsSync(dir))
                {
                    fs.mkdirSync(dir);
                }

                // Split to name, time, and due date
                let i=2, allArgs="";
                while(args[i])
                {
                    allArgs+=(' '+args[i]);
                    i++;
                }
                allArgs = allArgs.trim().split(',');
                allArgs[0] = allArgs[0].replace(/['“”"]+/g, '');

                // Check if it is editing command
                let before;
                if(args[1].toLowerCase() == "edit")
                {
                    before = JSON.parse(fs.readFileSync(`./homework_storage/${message.author.id}/${allArgs[0]}.json`, 'utf8'));
                }

                // Declare extra var for easier target
                let due_date = new Date(allArgs[2]);
                if(due_date == "Invalid Date") { message.channel.send("**Invalid date & time format**\nPlease type date in this format\n`YYYY/MM/DD HH:MM`"); break; }
                let total_time = {};
                if(allArgs[1].includes(':'))
                {
                    let temp = allArgs[1].split(':');
                    total_time = {
                        "hour": parseInt(temp[0]),
                        "minute": parseInt(temp[1])
                    };
                }
                else if(allArgs[1].includes('.') || parseInt(allArgs[1]) == Math.round(Number(allArgs[1])))
                {
                    total_time = {
                    "hour": parseInt(allArgs[1]),
                    "minute": Math.round((Number(allArgs[1])-parseInt(allArgs[1]))*60)
                    };
                }
                else
                {
                    message.channel.send("Invalid Time syntax");
                }
                
                // Write homework to file
                let textToWrite = "";
                textToWrite = {
                    "name": allArgs[0],
                    "hour": total_time.hour,
                    "minute": total_time.minute,
                    "dueDate": due_date
                };
                textToWrite = JSON.stringify(textToWrite);
                fs.writeFileSync(dir+'/'+allArgs[0]+'.json',textToWrite);

                // Responding to user
                if(args[1].toLowerCase() == "edit")
                {
                    message.channel.send(`__**Edited ${allArgs[0]}**__\n`
                    +"Total time: "+before.hour + ` hour${before.hour > 1 ? 's':''} ` + before.minute + ` minute${before.minute > 1 ? 's':''} -> `
                    + `${total_time.hour} hour${total_time.hour > 1 ? 's':''} ${total_time.minute} minute${total_time.minute > 1 ? 's':''}\n`
                    + `Due date: ${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()}`
                    +` ${due_date.getHours()>=10 ? "" : "0"}${due_date.getHours()}:${due_date.getMinutes()>=10 ? "" : "0"}${due_date.getMinutes()}`);
                    break;
                }

                message.channel.send(`__**${allArgs[0]}**__\n`+"Total time: "+total_time.hour + " hours " + total_time.minute + " minutes\n"
                + `Due date: ${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()}`
                +` ${due_date.getHours()>=10 ? ""+due_date.getHours() : "0"+due_date.getHours()}:${due_date.getMinutes()>=10 ? ""+due_date.getMinutes() : "0"+due_date.getMinutes()}`);
                break;
            }
            case "list" :
            {
                // console.log("List :");
                const homeworkFiles = fs.readdirSync(`./homework_storage/${message.author.id}`);
                let embedList = new Discord.MessageEmbed()
                    .setColor(embedColor)
                    .setTitle("Homework List")
                    .setAuthor(`${message.author.username}#${message.author.discriminator}`,message.author.avatarURL())
                    .setDescription(`@${message.author.username}#${message.author.discriminator}`)
                    .setThumbnail(message.author.avatarURL());
                for(const file of homeworkFiles)
                {
                    // console.log(file);
                    let txt = fs.readFileSync(`./homework_storage/${message.author.id}/${file}`, 'utf8');
                    txt = JSON.parse(txt);
                    let due_date = new Date(txt.dueDate);
                    // console.log(txt);

                    embedList.addField(`__**${txt.name}**__`
                    ,"Total time: "+txt.hour + " hours " + txt.minute + " minutes\n"
                    + `Due date: ${due_date.getDate()}/${due_date.getMonth()+1}/${due_date.getFullYear()}`
                    +` ${due_date.getHours()>=10 ? ""+due_date.getHours() : "0"+due_date.getHours()}:${due_date.getMinutes()>=10 ? ""+due_date.getMinutes() : "0"+due_date.getMinutes()}`);
                }
                message.channel.send(embedList);
                break;
            }
            case "erase" :
            case "remove" :
            case "done" :
            case "clear" :
            {
                // Remove all files
                if(args[2].toLowerCase().trim() == "all")
                {
                    const homeworkFiles = fs.readdirSync(`./homework_storage/${message.author.id}`);
                    const hw_length = homeworkFiles.length;
                    for(const file of homeworkFiles)
                    {
                        fs.unlinkSync(`./homework_storage/${message.author.id}/${file}`);
                    }
                    message.channel.send(`Successfully remove all ${hw_length} homework${hw_length>1 ? 's':''} in your list`);
                }

                // Merge the space after command
                allArgs="";
                for(let i=2;i<args.length;i++)
                {
                    allArgs+=(' '+args[i]);
                }
                allArgs = allArgs.trim().split(',');
                allArgs = allArgs[0].replace(/['“”"]+/g, '');
                message.channel.send("Debug (allArgs) : " + allArgs);

                // Remove homework file from list

                try {fs.unlinkSync(`./homework_storage/${message.author.id}/${allArgs}.json`);}
                catch
                {
                    message.channel.send(`There is no __${allArgs}__ in the homework list`);
                }
                // Remove reminder event of the homework
                

                break;
            }
            default :
            {
                message.channel.send(`There is no ${args[2]} command in homework section`);
            }
        }
    }
};
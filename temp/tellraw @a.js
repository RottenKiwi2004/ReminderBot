module.exports =
{
    name: "tellraw @a",
    description: "tell everyone",
    execute(message, args)
    {
        message.channel.send(`@everyone ${args}`);
    }
}
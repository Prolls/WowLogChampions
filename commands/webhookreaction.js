const Command = require('./command')
module.exports = class WebHookReaction extends Command {
     match(message) {
        // console.log(message.author.bot);
        // console.log(message.author.username);
        // console.log(message.webhookId);
        // console.log(message.embeds[0].data.url);
        if (!message.embeds[0])
        {return false;}
        else
        {
        return (message.author.bot === true && message.webhookId !== null && message.embeds[0].data.url)
        }
    }

     action(message) {
        var reportId = message.embeds[0].data.url.slice(37)
        message.reply('Utilisez !logs ' + reportId + ' ou !logs pour afficher le palmares en cours de ce raid.')
    }


}
const Command = require('./command')
module.exports = class SmallTalk extends Command {
    match (message){
        console.log('message.content');
        return message.content.startsWith('!') && !message.content.startsWith('!logs')
    }

    action (message) {
        console.log('message.content2');
        if (message.content === '!keys'){
            message.reply('Ca suffit Wiwi!')
        }
    }


}
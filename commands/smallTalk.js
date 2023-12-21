const Command = require('./command')
module.exports = class SmallTalk extends Command {
    match (message){
        return message.content.startsWith('!keys') && !message.content.startsWith('!logs')
    }

    action (message) {
        if (message.content === '!keys'){
            message.reply('Ca suffit Wiwi!')
        }
    }


}
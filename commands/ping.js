const Command = require('./command')
module.exports = class Ping extends Command {
    match (message){
        return message.content.startsWith('!ping')
    }

    action (message) {
        message.reply('Coucouille')
    }


}
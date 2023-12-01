const Command = require('./command')
const Logs = require('../logs')
module.exports = class Ping extends Command {
    match (message){
        return message.content.startsWith('!palmares')
    }

    async action (message) {
        var log = new Logs();
        log.getDeathCount().then((palmares) => {
            var carpette = 'La carpette est ' + palmares.carpette.nom + ': ' + palmares.carpette.nombre + ' morts';
            var highlander = 'Le highlander est ' + palmares.highlander.nom + ': ' + palmares.highlander.nombre + ' morts';

            var formattedText =
                '+------+---------------+-----------------+-----------+--+'
                '| Mort | La carpette   | Dolipraneuhhhhh | 100 morts |  |'
                '|      +---------------+-----------------+-----------+--+'
                '|      | Le highlander | Dolipraneuhhhhh | 100 morts |  |'
                '+------+---------------+-----------------+-----------+--+'
            message.reply(carpette);
            message.reply(highlander);
         } )


        
    }


}
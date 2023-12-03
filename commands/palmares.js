const Command = require('./command')
const Logs = require('../logs')
const Discord = require('discord.js')

module.exports = class Ping extends Command {
    match(message) {

        return message.content.startsWith('!logs')
    }


    async action(message) {
        var log = new Logs();

        var report = await log.getReportId(message.content);
        var reportDetail = await log.getReportdetail(report);
        console.log(report)
        console.log(reportDetail)
        // test report: 'V9MJr1kYFqTAn7Ng';
        var startTime = 0;
        var endTime = 9999999999999;

        var palmares = {
            maxMort:
            {
                surnom: 'Mort le plus - La Carpette',
                nom: '',
                nombre: 0,
                type: 'morts'
            },
            minMort:
            {
                surnom: 'Mort le moins -Highlander',
                nom: '',
                nombre: 99,
                type: 'morts'
            },
            maxDispel:
            {
                surnom: '1er sur les dispels dispels - Le Nettoyeur',
                nom: '',
                nombre: 0,
                type: 'dispels'
            },
            maxInterrupt:
            {
                surnom: '1er sur les interruptions - Le Baillonneur',
                nom: '',
                nombre: 0,
                type: 'interruptions'
            },
            firstdps:
            {
                surnom: '1er DPS - Chuck Norris',
                nom: '',
                nombre: 0,
                type: 'DPS'
            },
            seconddps:
            {
                surnom: '2ème DPS - Rambo',
                nom: '',
                nombre: 0,
                type: 'DPS'
            },
            thirddps:
            {
                surnom: '3ème DPS - Terminator',
                nom: '',
                nombre: 0,
                type: 'DPS'
            },
            firsthps:
            {
                surnom: '1er HPS - Docteur House',
                nom: '',
                nombre: 0,
                type: 'HPS'
            },
            secondhps:
            {
                surnom: '2ème HPS - Docteur Mamour (2ème)',
                nom: '',
                nombre: 0,
                type: 'HPS'
            },
            minDegatsSubis:
            {
                surnom: "le moins de dégats subis - L'esquiveur",
                nom: '',
                nombre: 0,
                type: 'DTPS'
            },
            maxDegatsSubis:
            {
                surnom: 'le plus dégats subis - Le Slacker',
                nom: '',
                nombre: 0,
                type: 'DTPS'
            },
        };

        await Promise.all([log.getDeathCount(report, startTime, endTime, palmares),
        log.getDispelCount(report, startTime, endTime, palmares),
        log.getInterruptCount(report, startTime, endTime, palmares),
        log.getDpsCount(report, palmares),
        log.getHpsCount(report, palmares),
        log.getDtpsCount(report, startTime, endTime, palmares)
        ]);

        const palmaresMessage = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(reportDetail.title)
            .setAuthor({ name: 'Warcraft Logs', iconURL: 'https://assets.rpglogs.com/img/warcraft/favicon.png?v=2', url: 'https://www.warcraftlogs.com/reports/'+report })
            .setDescription(':unicorn: Palmares des sentis :unicorn: ')
            // .setThumbnail('https://i.imgur.com/AfFp7pu.png')
            .setTimestamp(reportDetail.startTime)
            .addFields(
                { name: palmares.firstdps.surnom, value: palmares.firstdps.nom +' avec '+ palmares.firstdps.nombre + ' ' + palmares.firstdps.type, inline: true  },
                { name: palmares.seconddps.surnom, value: palmares.seconddps.nom +' avec '+ palmares.seconddps.nombre + ' ' + palmares.seconddps.type , inline: true },
                { name: palmares.thirddps.surnom, value: palmares.thirddps.nom +' avec '+ palmares.thirddps.nombre + ' ' + palmares.thirddps.type, inline: true  },
                { name: ' ', value: ' ' },
                { name: palmares.firsthps.surnom, value: palmares.firsthps.nom +' avec '+ palmares.firsthps.nombre + ' ' + palmares.firsthps.type, inline: true  },
                { name: palmares.secondhps.surnom, value: palmares.secondhps.nom +' avec '+ palmares.secondhps.nombre + ' ' + palmares.secondhps.type, inline: true  },
                { name: ' ', value: ' ' },
                { name: palmares.minDegatsSubis.surnom, value: palmares.minDegatsSubis.nom +' avec '+ palmares.minDegatsSubis.nombre + ' ' + palmares.minDegatsSubis.type, inline: true },
                { name: palmares.maxDegatsSubis.surnom, value: palmares.maxDegatsSubis.nom +' avec '+ palmares.maxDegatsSubis.nombre + ' ' + palmares.maxDegatsSubis.type, inline: true },
                { name: ' ', value: ' ' },
                { name: palmares.maxMort.surnom, value: palmares.maxMort.nom +' avec '+ palmares.maxMort.nombre + ' ' + palmares.maxMort.type, inline: true },
                { name: palmares.minMort.surnom, value: palmares.minMort.nom +' avec '+ palmares.minMort.nombre + ' ' + palmares.minMort.type, inline: true },
                { name: ' ', value: ' ' },
                { name: palmares.maxDispel.surnom, value: palmares.maxDispel.nom +' avec '+ palmares.maxDispel.nombre + ' ' + palmares.maxDispel.type, inline: true },
                { name: palmares.maxInterrupt.surnom, value: palmares.maxInterrupt.nom +' avec '+ palmares.maxInterrupt.nombre + ' ' + palmares.maxInterrupt.type, inline: true },

            )
        // var chan = new Discord.BaseGuildTextChannel({guild)
        // chan.send({ embeds: [palmaresMessage] });
        message.channel.send({ embeds: [palmaresMessage] });
    }


}
const Command = require('./command')
const json = require('./data/journees.json')
const Discord = require('discord.js')
module.exports = class Journee extends Command {
    match(message) {
        return message.content.startsWith('!transmo')
    }

    action(message) {
        if (message.content === '!transmo') {
            let raidList = this.getnextRaidDates(2);
            const journeesMessage = new Discord.EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Prochaines transmos de raid")
                .setAuthor({ name: 'journee-mondiale.com', url: 'https://www.journee-mondiale.com/les-journees-mondiales.htm' })
            console.log(raidList)
            for (const raidDate of raidList) {
                let stringJour = ''
                let transmoFormattedDate = raidDate.formatedDate;
                let transmoDate = new Date(raidDate.date)
                if (!json[transmoFormattedDate]) {
                    transmoDate.setDate(transmoDate.getDate() - 1);
                    transmoFormattedDate = this.formatDate(transmoDate);
                    if (!json[transmoFormattedDate]) {
                        transmoDate = new Date(raidDate.date)
                        transmoDate.setDate(transmoDate.getDate() + 1);
                        transmoFormattedDate = this.formatDate(transmoDate)
                    }
                }
                for (const jour of json[transmoFormattedDate]) {
                    if (stringJour === '') { stringJour = jour['Journée']; }
                    else { stringJour = stringJour + '\n' + jour['Journée']; }
                }
                journeesMessage.addFields({ name: raidDate.date, value: stringJour, inline: false })
            }

            message.channel.send({ embeds: [journeesMessage] });
        }
    }
    getnextRaidDates(numberRaids) {
        let dateList = [];
        let testedDate = new Date(); //today
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        while (dateList.length <= numberRaids) {
            if (testedDate.getDay() == 1 || testedDate.getDay() == 3) { // If Monday or Wednesday
                dateList.push({ date: testedDate.toLocaleDateString('fr-FR', options), formatedDate: this.formatDate(testedDate) });
            }
            testedDate.setDate(testedDate.getDate() + 1);
        }
        return dateList;
    }

    padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    formatDate(date) {
        return [
            this.padTo2Digits(date.getDate()),
            this.padTo2Digits(date.getMonth() + 1),
        ].join('-');
    }

}
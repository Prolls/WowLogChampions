const ClientOAuth2 = require('client-oauth2')
const res = require('restify');
const req = require('request');
// const https = require('https');

module.exports = class Logs {

    getToken() {

        // If already exist
        if (process.env['TOKEN']) {
            var token = { accessToken: process.env['TOKEN'] };
            return new Promise(
                (resolve, reject) => {
                    try {
                        resolve(token);
                    } catch (e) { reject(e); }
                });
        }


        var WowLogAuth = new ClientOAuth2({
            clientId: process.env['CLIENT_ID'],
            clientSecret: process.env['CLIENT_SECRET'],
            accessTokenUri: 'https://www.warcraftlogs.com/oauth/token',
            authorizationUri: 'https://www.warcraftlogs.com/oauth/authorize',
            scopes: []
        })

        return WowLogAuth.credentials.getToken()

    }

    async GetLogs(query) {

        const token = await this.getToken()
            .then((token) => { process.env['TOKEN'] = token.accessToken })

        var options = {
            url: 'https://www.warcraftlogs.com/api/v2/client',
            method: 'GET',
            body: query,
            headers: {
                'Authorization': 'Bearer ' + process.env['TOKEN'],
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        return new Promise(function (resolve, reject) {
            req(options, (error, response, body) => {
                // console.log(error);
                // console.log(body);
                // console.log(response.statusCode);
                try {
                    resolve(body);
                } catch (e) { reject(e); }
            });
        })

    }

    async getLastReportId() {
        const data = JSON.stringify({
            query: `{ 
                reportData	{
                    reports(guildID: 73955, limit: 1) {
                        data {
                            code
                            title
                        }
                    }
                }
            }`,
        });
        var res = await this.GetLogs(data)
        return JSON.parse(res).data.reportData.reports.data[0].code

    }
    async getReportId(content) {
        var reportId = '';
        if (content.slice(6) == '') {
            reportId = await this.getLastReportId();
        }
        else {
            reportId = content.slice(6);
        }
        return reportId;

    }

    async getEventCount(report, startTime, endTime, dataType) {
        const data = JSON.stringify({
            query: `{ 
            reportData	{
                report(code: "`+ report + `") {
                    code
                    title
                    table(startTime: `+ startTime + `, endTime: ` + endTime + `, dataType: ` + dataType + `)
                }
            }
        }`,
        });
        return this.GetLogs(data)

    }

    async getDeathCount(report, startTime, endTime, palmares) {

        const res = await this.getEventCount(report, startTime, endTime, 'Deaths');
        this.buildDeathPalmares(res, palmares);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }
    async getMetricCount(report, dataType) {
        const data = JSON.stringify({
            query: `{ 
            reportData	{
                report(code: "`+ report + `") {
                    rankings(playerMetric: `+ dataType + `)
                }
            }
        }`,
        });
        return this.GetLogs(data)

    }

    async getDispelCount(report, startTime, endTime, palmares) {

        const res = await this.getEventCount(report, startTime, endTime, 'Dispels');
        this.buildReactivityPalmares(res, palmares.maxDispel);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }

    async getInterruptCount(report, startTime, endTime, palmares) {

        const res = await this.getEventCount(report, startTime, endTime, 'Interrupts');
        this.buildReactivityPalmares(res, palmares.maxInterrupt);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }

    async getDpsCount(report, palmares) {

        const res = await this.getMetricCount(report, 'dps');
        this.buildDpsPalmares(res, palmares);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }

    async getHpsCount(report, palmares) {

        const res = await this.getMetricCount(report, 'hps');
        this.buildHpsPalmares(res, palmares);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }

    async getDtpsCount(report, startTime, endTime, palmares) {

        const res = await this.getEventCount(report, startTime, endTime, 'DamageTaken');
        this.buildDtpsPalmares(res, palmares);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }


    buildDeathPalmares(res, palmares) {
        var deathCount = [];

        JSON.parse(res).data.reportData.report.table.data.entries.forEach(
            (death) => {
                var deathName = String(death.name);
                if (isNaN(deathCount[deathName])) {
                    deathCount[deathName] = 1;
                } else {
                    deathCount[deathName] = deathCount[deathName] + 1;
                }
            }
        )

        for (var name in deathCount) {
            if (palmares.maxMort.nombre === deathCount[name]) {
                palmares.maxMort.nom = palmares.maxMort.nom + ' / ' + name;
            }
            else if (palmares.maxMort.nombre < deathCount[name]) {
                palmares.maxMort.nombre = deathCount[name];
                palmares.maxMort.nom = name;
            }

            if (palmares.minMort.nombre > deathCount[name]) {
                palmares.minMort.nombre = deathCount[name];
                palmares.minMort.nom = name;
            }
            else if (palmares.minMort.nombre === deathCount[name]) {
                palmares.minMort.nom = palmares.minMort.nom + ' / ' + name;
            }
        };
    }

    buildReactivityPalmares(res, palmares) {
        var eventCount = [];


        JSON.parse(res).data.reportData.report.table.data.entries[0].entries.forEach(
            (entries) => {
                entries.details.forEach(
                    (details) => {
                        var Name = String(details.name);
                        if (isNaN(eventCount[Name])) {
                            eventCount[Name] = details.total;
                        } else {
                            eventCount[Name] = eventCount[Name] + details.total;
                        }
                    }
                )
            }
        )

        for (var name in eventCount) {
            if (palmares.nombre === eventCount[name]) {
                palmares.nom = palmares.nom + ' / ' + name;
            }
            else if (palmares.nombre < eventCount[name]) {
                palmares.nombre = eventCount[name];
                palmares.nom = name;
            }
        };
    }

    buildPerformancePalmares(res, palmares) {
        var eventCount = [];
        JSON.parse(res).data.reportData.report.rankings.data.forEach(
            (fight) => {

                fight.roles.dps.characters.forEach(
                    (character) => {
                        var Name = String(character.name);
                        if (!eventCount[Name]) {
                            eventCount[Name] = { totalAmount: character.amount, totalParse: 1 };
                        } else {
                            eventCount[Name] = { totalAmount: eventCount[Name].totalAmount + character.amount, totalParse: eventCount[Name].totalParse + 1 };
                        }
                    }
                )
                fight.roles.tanks.characters.forEach(
                    (character) => {
                        var Name = String(character.name);
                        if (!eventCount[Name]) {
                            eventCount[Name] = { totalAmount: character.amount, totalParse: 1 };
                        } else {
                            eventCount[Name] = { totalAmount: eventCount[Name].totalAmount + character.amount, totalParse: eventCount[Name].totalParse + 1 };
                        }
                    }
                )
                fight.roles.healers.characters.forEach(
                    (character) => {
                        var Name = String(character.name);
                        if (!eventCount[Name]) {
                            eventCount[Name] = { totalAmount: character.amount, totalParse: 1 };
                        } else {
                            eventCount[Name] = { totalAmount: eventCount[Name].totalAmount + character.amount, totalParse: eventCount[Name].totalParse + 1 };
                        }
                    }
                )
            }
        )
        // Fabrication de la liste finale triée décroissant
        var metricList = [];
        for (var name in eventCount) {
            var metricResult = {};
            metricResult.name = name;
            if (eventCount[name].totalParse == 0) { metricResult.count = 0 }
            else { metricResult.count = Math.round(eventCount[name].totalAmount / eventCount[name].totalParse); }
            metricList.push(metricResult)
        }
        metricList.sort((a, b) => b.count - a.count)
        return metricList;

    }
    buildDpsPalmares(res, palmares) {
        var metricList = this.buildPerformancePalmares(res, palmares);

        palmares.firstdps.nom = metricList[0].name;
        palmares.firstdps.nombre = metricList[0].count;
        palmares.seconddps.nom = metricList[1].name;
        palmares.seconddps.nombre = metricList[1].count;
        palmares.thirddps.nom = metricList[2].name;
        palmares.thirddps.nombre = metricList[2].count;
    }
    buildHpsPalmares(res, palmares) {
        var metricList = this.buildPerformancePalmares(res, palmares);

        palmares.firsthps.nom = metricList[0].name;
        palmares.firsthps.nombre = metricList[0].count;
        palmares.secondhps.nom = metricList[1].name;
        palmares.secondhps.nombre = metricList[1].count;
    }

    buildDtpsPalmares(res, palmares) {
        var eventCount = [];

        JSON.parse(res).data.reportData.report.table.data.entries.forEach(
            (character) => {
                if (character.type !== 'NPC' && character.icon !== 'Warrior-Protection' && character.icon !== 'DeathKnight-Blood' && character.icon !== 'Druid-Gardian' && character.icon !== 'Monk-Brewmaster' && character.icon !== 'DemonHunter-Vengeance') {
                    var Name = String(character.name);
                    if (!eventCount[Name]) {
                        eventCount[Name] = { totalAmount: character.totalReduced, totalParse: character.activeTimeReduced };
                    } else {
                        eventCount[Name] = { totalAmount: eventCount[Name].totalReduced + character.amount, totalParse: eventCount[Name].totalParse + character.activeTimeReduced };
                    }
                }
            }
        )

        // Fabrication de la liste finale triée décroissant
        var metricList = [];
        for (var name in eventCount) {
            var metricResult = {};
            metricResult.name = name;
            if (eventCount[name].totalParse == 0) { metricResult.count = 0 }
            else { metricResult.count = Math.round(eventCount[name].totalAmount / eventCount[name].totalParse * 1000); }
            metricList.push(metricResult)
        }
        metricList.sort((a, b) => b.count - a.count)


        var lastLine = metricList.length - 1;
        palmares.minDegatsSubis.nom = metricList[lastLine].name;
        palmares.minDegatsSubis.nombre = metricList[lastLine].count;
        palmares.maxDegatsSubis.nom = metricList[0].name;
        palmares.maxDegatsSubis.nombre = metricList[0].count;
    }

}
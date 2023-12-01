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
                console.log(error);
                console.log(response.statusCode);
                try {
                    resolve(body);
                } catch (e) { reject(e); }
            });
        })

    }

    async getDeathCount() {
        const data = JSON.stringify({
            query: `{ 
                reportData	{
                    report(code: "V9MJr1kYFqTAn7Ng") {
                        code
                        title
                        table(startTime: 121380, endTime: 6965591, dataType: Deaths)
                    }
                }
            }`,
        });

        const res = await this.GetLogs(data)
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
        var palmares = {
            carpette:
            {
                nom: '',
                nombre: 0
            },
            highlander:
            {
                nom: '',
                nombre: 99
            },
        };

        for (var name in deathCount) {
            if (palmares.carpette.nombre === deathCount[name]) {
                palmares.carpette.nom = palmares.carpette.nom + ' / ' + name;
            }
            else if (palmares.carpette.nombre < deathCount[name]) {
                palmares.carpette.nombre = deathCount[name];
                palmares.carpette.nom = name;
            }

            if (palmares.highlander.nombre > deathCount[name]) {
                palmares.highlander.nombre = deathCount[name];
                palmares.highlander.nom = name;
            }
            else if (palmares.highlander.nombre === deathCount[name]) {
                palmares.highlander.nom = palmares.highlander.nom + ' / ' + name;
            }
        };

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })


    }

}
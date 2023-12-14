const ClientOAuth2 = require('client-oauth2')
const https = require('https');
const res = require('restify');
const req = require('request');

module.exports = class LogsQuery {
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

    async queryLastReportId() {
        const data = JSON.stringify({
            query: `{ 
            reportData	{
                reports(guildID: ` + process.env['GUILD_ID'] + `, limit: 1) {
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

    async queryReportdetail(reportId) {
        const data = JSON.stringify({
            query: `{ 
            reportData	{
                report(code: "`+ reportId + `") {
                    code
                    endTime
                    title
                    startTime
                }
            }
        }`,
        });
        return this.GetLogs(data);
        
    }
    async queryEventCount(report, startTime, endTime, dataType) {
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

    async queryMetricCount(report, dataType) {
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
}
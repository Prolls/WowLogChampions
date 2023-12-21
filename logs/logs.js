const LogQuery = require('./logsqueries')
const LogFormatter = require('./logformatter')

module.exports = class Logs {

    constructor() {
        this.logQuery = new LogQuery();
        this.logFormatter = new LogFormatter();
      }
    async getReportId(content) {
        var reportId = '';
        if (content.slice(6) == '') {
            reportId = await this.logQuery.queryLastReportId();
        }
        else {
            reportId = content.slice(6);
        }
        return reportId;
    }

    async getReportdetail(reportId) {
        const res = await this.logQuery.queryReportdetail(reportId);
        var reportDetail = this.logFormatter.buildReportDetail(res);
        return new Promise((resolve, reject) => {
            try {
                resolve(reportDetail);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }

    async getDeathCount(report, startTime, endTime, palmares) {

        const res = await this.logQuery.queryEventCount(report, startTime, endTime, 'Deaths');
        this.logFormatter.buildDeathPalmares(res, palmares);

        return new Promise((resolve, reject) => {
            try {
                resolve(palmares);
            } catch (e) {
                console.log('error');
                reject(e);
            }
        })
    }
    

    async getDispelCount(report, startTime, endTime, palmares) {

        const res = await this.logQuery.queryEventCount(report, startTime, endTime, 'Dispels');
        this.logFormatter.buildReactivityPalmares(res, palmares.maxDispel);

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

        const res = await this.logQuery.queryEventCount(report, startTime, endTime, 'Interrupts');
        this.logFormatter.buildReactivityPalmares(res, palmares.maxInterrupt);

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

        const res = await this.logQuery.queryMetricCount(report, 'dps');
        this.logFormatter.buildDpsPalmares(res, palmares,);

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

        const res = await this.logQuery.queryMetricCount(report, 'hps');
        this.logFormatter.buildHpsPalmares(res, palmares,);

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

        const res = await this.logQuery.queryEventCount(report, startTime, endTime, 'DamageTaken');
        this.logFormatter.buildDtpsPalmares(res, palmares);

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
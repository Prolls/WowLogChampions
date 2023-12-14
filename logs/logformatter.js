module.exports = class LogsFormatter {

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
    buildReportDetail(res) {
        var report = JSON.parse(res).data.reportData.report;
        return {
            code: report.code,
            endTime: report.endTime,
            title: report.title,
            startTime: report.startTime,
            formattedStartDate: new Date(report.startTime * 1000),
        }
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

    buildPerformancePalmares(res, palmares, includeTanks) {
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
                if (includeTanks) {
                fight.roles.tanks.characters.forEach(
                    (character) => {
                        var Name = String(character.name);
                        if (!eventCount[Name]) {
                            eventCount[Name] = { totalAmount: character.amount, totalParse: 1 };
                        } else {
                            eventCount[Name] = { totalAmount: eventCount[Name].totalAmount + character.amount, totalParse: eventCount[Name].totalParse + 1 };
                        }
                    }
                )}
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
            if (!isNaN(metricResult.count)) { metricList.push(metricResult) }
        }
        metricList.sort((a, b) => b.count - a.count)
        return metricList;

    }
    buildDpsPalmares(res, palmares) {
        var metricList = this.buildPerformancePalmares(res, palmares, true);

        palmares.firstdps.nom = metricList[0].name;
        palmares.firstdps.nombre = metricList[0].count;
        palmares.seconddps.nom = metricList[1].name;
        palmares.seconddps.nombre = metricList[1].count;
        palmares.thirddps.nom = metricList[2].name;
        palmares.thirddps.nombre = metricList[2].count;
    }
    buildHpsPalmares(res, palmares) {
        var metricList = this.buildPerformancePalmares(res, palmares, false);

        palmares.firsthps.nom = metricList[0].name;
        palmares.firsthps.nombre = metricList[0].count;
        palmares.secondhps.nom = metricList[1].name;
        palmares.secondhps.nombre = metricList[1].count;
    }

    buildDtpsPalmares(res, palmares) {
        var eventCount = [];

        JSON.parse(res).data.reportData.report.table.data.entries.forEach(
            (character) => {
                if (character.type !== 'NPC' && character.type !== 'Unknown' && character.icon !== 'Warrior-Protection' && character.icon !== 'DeathKnight-Blood' 
                        && character.icon !== 'Druid-Gardian' && character.icon !== 'Monk-Brewmaster' && character.icon !== 'DemonHunter-Vengeance') {
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
            if (!isNaN(metricResult.count)) { metricList.push(metricResult) }
        }
        metricList.sort((a, b) => b.count - a.count)

        if (metricList.length >= 1) {
            var lastLine = metricList.length - 1;
            palmares.minDegatsSubis.nom = metricList[lastLine].name;
            palmares.minDegatsSubis.nombre = metricList[lastLine].count;
            palmares.maxDegatsSubis.nom = metricList[0].name;
            palmares.maxDegatsSubis.nombre = metricList[0].count;
        }
    }
}
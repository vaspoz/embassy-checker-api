const checkIfNewDateIsAvailableMain = require("./puppeteer");
const publish = require("./publish");
const config = require("../config.json");

console.log("Checking config... " + JSON.stringify(config));
// h * 60 * 60 * 1000
let hoursDelay = config.hoursDelay;

let earliestDate = new Date("2025-12-26");
process.env.GOOGLE_APPLICATION_CREDENTIALS = "embassy-scheduler.json";

const mainLoop = () => {
    setTimeout(() => {
        sendDailyReportWhenEvening();
        outputNewIterationInfo();
        checkIfNewDateIsAvailableMain(config, setEarliestDate, handleWrongParsing, exceptionHandling);
        mainLoop();
    }, hoursDelay * 60 * 60 * 1000);
};

sendDailyReportWhenEvening = () => {
    let currDate = new Date();
    let hour = currDate.getHours();
    let minutes = currDate.getMinutes();

    if (hour === 22 && minutes <= 30) {
        publish("Daily report. Earliest date found today is [" + consoleOutDate(earliestDate) + "]");
    }
};

function outputNewIterationInfo() {
    console.log();
    console.log();
    console.log("====  Start New Iteration  ====");
    console.log("Current datetime:\t\t" + new Date());
    console.log("Current earliest date:\t\t" + consoleOutDate(earliestDate));
}

setEarliestDate = (dateString) => {
    if (!dateString) {
        publish("Unfortunately, there are no dates available at the moment. Will retry later.");
        console.log("====  Stop iteration  ====");
        return;
    }

    // dateString = '26.06.2020'
    let stringTokens = dateString.split(".");
    let receivedDate = new Date(`${stringTokens[2]}-${stringTokens[1]}-${stringTokens[0]}`);

    console.log("Received date:\t\t" + consoleOutDate(receivedDate));
    console.log("Current earliest date:\t" + consoleOutDate(earliestDate));

    if (datesNotTheSame(receivedDate, earliestDate)) {
        if (receivedDate < earliestDate) {
            earliestDate = receivedDate;
            console.log(
                "\r\nGotcha!\r\nReceived date is before\r\nthan saved earliest date.\r\nUpdating the date to:\t" + consoleOutDate(earliestDate)
            );
            publish("I founded a new earliest date: " + dateString);
        } else {
            earliestDate = receivedDate;
            console.log(
                "New date is after saved earliest date.\r\nSomeone's picked it up. Shifting next available date to:\t" + consoleOutDate(earliestDate)
            );
        }
    } else {
        console.log("Received date is later than saved earliest date. Do nothing.");
    }
    console.log("====  Stop iteration  ====");
};

datesNotTheSame = (date1, date2) => {
    date1.setHours(0, 0, 0, 0);
    date2.setHours(0, 0, 0, 0);
    return date1.getTime() !== date2.getTime();
};

handleWrongParsing = (number) => {
    console.log("[ERROR] Quality of Image was bad, thus parsing failed [" + number + "]. I will retry it again.");
    checkIfNewDateIsAvailableMain(setEarliestDate, handleWrongParsing, exceptionHandling);
};

exceptionHandling = (exceptionString) => {
    console.log("Exception had occurred: " + exceptionString + "\r\nI will retry it again");
    checkIfNewDateIsAvailableMain(setEarliestDate, handleWrongParsing, exceptionHandling);
};

consoleOutDate = (datestr) => {
    return datestr.getDate() + "." + (datestr.getMonth() + 1) + "." + datestr.getFullYear();
};

console.log("Starting the first iteration");
// just a first run:
checkIfNewDateIsAvailableMain(config, setEarliestDate, handleWrongParsing, exceptionHandling);

mainLoop();

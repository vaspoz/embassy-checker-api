const scrapper = require('./puppeteer');
const bird = require('./messageBird');

// h * 60 * 60 * 1000
let hoursDelay = 0.5;

let earliestDate = new Date('2020-12-26');

(function myLoop(i) {
    setTimeout(() => {
        console.log();
        console.log();
        console.log('====  Start New Iteration  ====');
        console.log('Current datetime:\t\t' + new Date());
        console.log('Current earliest date:\t\t' + consoleOutDate(earliestDate));
        scrapper(setEarliestDate, handleWrongParsing, exceptionHandling);
        if (--i) myLoop(i);
        }, hoursDelay * 60 * 60 * 1000)
})(20);


const setEarliestDate = (dateString) => {
    // dateString = '26.06.2020'
    console.log('Received date:\t\t' + dateString);
    let stringTokens = dateString.split('.');
    let receivedDate = new Date(`${stringTokens[2]}-${stringTokens[1]}-${stringTokens[0]}`);

    if (receivedDate < earliestDate) {
        earliestDate = receivedDate;
        console.log('\r\nGotcha!\r\nReceived date is before\r\nthan saved earliest date.\r\nUpdating the date to:\t' + consoleOutDate(earliestDate));
        bird('Master, I found a new earliest date: ' + dateString);
    } else {
        console.log('Received date is later than saved earliest date. Do nothing.');
    }
    console.log('====  Stop iteration  ====');
};

const exceptionHandling = (exceptionString) => {
    console.log('Exception had occurred: ' + exceptionString + '\r\nI will retry it again');
    scrapper(setEarliestDate, handleWrongParsing, exceptionHandling);
};

const handleWrongParsing = (number) => {
    console.log('[ERROR] Quality of Image was bad, thus parsing failed [' + number + ']. I will retry it again.');
    scrapper(setEarliestDate, handleWrongParsing, exceptionHandling);
};

const consoleOutDate = (datestr) => {
    return datestr.getDate() + '.' + (datestr.getMonth() + 1) + '.' + datestr.getFullYear();
};

// just a first run:
scrapper(setEarliestDate, handleWrongParsing, exceptionHandling);
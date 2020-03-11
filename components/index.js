const scrapper = require('./puppeteer');
const bird = require('./messageBird');

// h * 60 * 60 * 1000
let hoursDelay = 0.5;

let earliestDate = new Date('2020-12-26');

// just a first run:
scrapper(setEarliestDate);

(function myLoop(i) {
    setTimeout(function () {
        scrapper(setEarliestDate);
        if (--i) myLoop(i);
        }, hoursDelay * 60 * 60 * 1000)
})(20);


const setEarliestDate = (dateString) => {
    // dateString = '26.06.2020'
    console.log('------------------------------------------');
    console.log('Current earliest date:\t\t\t' + earliestDate);
    console.log();
    console.log('Received date(before typisation):\t' + dateString);
    let stringTokens = dateString.split('.');
    let receivedDate = new Date(`${stringTokens[2]}-${stringTokens[1]}-${stringTokens[0]}`);
    console.log('Received date(after typisation):\t' + receivedDate);

    if (receivedDate < earliestDate) {
        earliestDate = receivedDate;
        console.log('\r\nGotcha!\r\nReceived date is before\r\nthan saved earliest date.\r\nUpdating the date to:\t' + earliestDate);
        bird('Master, I found a new earliest date: ' + dateString);
    } else {
        console.log('Received date is later than saved earliest date. Do nothing.');
    }
    console.log('------------------------------------------')
};
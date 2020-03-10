const scrapper = require('./puppeteer');

// h * 60 * 60 * 1000
let hoursDelay = 3;

(function myLoop(i) {
    setTimeout(function () {
        scrapper();
        if (--i) myLoop(i);
    }, hoursDelay * 60 * 60 * 1000)
})(2);

// let date1 = new Date('2020-05-24');
// let date2 = new Date('2020-06-01');
// console.log(date1);
// console.log(date2);
// console.log(date1 < date2);
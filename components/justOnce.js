const scrapper = require('./puppeteer');

scrapper((date) => {
    console.log(date);
}, (number) => {
    console.log('Incorrect secret code: ' + number);
}, (exceptionString) => {
    console.log('Caught an exception: ' + exceptionString);
});

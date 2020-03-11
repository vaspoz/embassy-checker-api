const scrapper = require('./puppeteer');

scrapper((date) => {
    console.log(date);
});

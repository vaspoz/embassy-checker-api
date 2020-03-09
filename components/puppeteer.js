const puppeteer = require('components/puppeteer');
const visionAPI = require('./index');

(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    let url2 = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";
    let url = "http://hague.kdmid.ru/";

    await page.goto(url);
    // await page.waitForSelector("#ctl00_MainContent_txtID");         //38704
    // await page.waitForSelector("#ctl00_MainContent_txtUniqueID");   //24E6A7C7
    // await page.waitForSelector("#ctl00_MainContent_txtCode");

    let enterSiteLink = (await page.$$('a'))[0];   //get the main links

    await Promise.all([
        page.waitForNavigation(),
        enterSiteLink.click({delay: 100})
    ]);

    // let's get the sub links
    let changeTimeButton = (await page.$$('#LinkButtonB'))[0];

    await Promise.all([
        page.waitForNavigation(),
        changeTimeButton.click({delay: 100})
    ]);

    await page.evaluate((a, b) => {
        document.querySelector('#ctl00_MainContent_txtID').value = a;
        document.querySelector('#ctl00_MainContent_txtUniqueID').value = b;
        // document.querySelector('#c').click();
    }, '38704', '24E6A7C7');

    await browser.close();
})();

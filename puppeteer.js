const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    let url2 = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";
    let url = "http://hague.kdmid.ru/";

    await page.goto(url);
    // await page.waitForSelector("#ctl00_MainContent_txtID");         //38704
    // await page.waitForSelector("#ctl00_MainContent_txtUniqueID");   //24E6A7C7
    // await page.waitForSelector("#ctl00_MainContent_txtCode");

//  how to click: await page.$eval('.foo', e => e.click());

    // page.$eval('a', e=> e.click());

    let arrMainLinks = (await page.$$('a'))[0];   //get the main links
    // arrMainLinks[0].click({delay:300});
    console.log(arrMainLinks.length); // 16


    await Promise.all([
        page.waitForNavigation(),
        arrMainLinks.click({delay: 100})
    ]);


    // let's get the sub links
    let arrSubLinks = (await page.$$('#LinkButtonB'))[0];

    await Promise.all([
        page.waitForNavigation(),
        arrSubLinks.click({delay: 100})
    ]);

    await browser.close();
})();

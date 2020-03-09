const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    let url = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";

    console.log(`Fetching page data for : ${url}...`);

    await page.goto(url);
    await page.waitForSelector("#ctl00_MainContent_txtID");         //38704
    await page.waitForSelector("#ctl00_MainContent_txtUniqueID");   //24E6A7C7
    await page.waitForSelector("#ctl00_MainContent_txtCode");

//  how to click: await page.$eval('.foo', e => e.click());

    let arrMainLinks: ElementHandle[] = await page.$$('.item.col-xs-3 > a');   //get the main links

    console.log(arrMainLinks.length); // 16


    for (let mainLink of arrMainLinks) //foreach main link let's click it
    {
        let hrefValue =await (await mainLink.getProperty('href')).jsonValue();
        console.log("Clicking on " + hrefValue);
        await Promise.all([
            page.waitForNavigation(),
            mainLink.click({delay: 100})
        ]);

        // let's get the sub links
        let arrSubLinks: ElementHandle[] = await page.$$('.slide >a');

        //let's click on each sub click
        for (let sublink of arrSubLinks)
        {
            console.log('██AAA');

            await Promise.all([
                page.waitForNavigation(),
                sublink.click({delay: 100})
            ]);
            console.log('██BBB');

            // await page.goBack()
            break;
        }
        break;

    }

    await browser.close();
})();

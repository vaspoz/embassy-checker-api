const puppeteer = require('puppeteer');
const visionAPI = require('./visionAPI');
const Clipper = require('image-clipper');
const Canvas = require('canvas');
const scrShot = require('desktop-screenshot');

(async () => {
    const input_id = '38704';
    const input_code = '24E6A7C7';

    const magicNumbersPath = 'components/images/magicNumbers.png';
    const tempScreenShot = 'components/images/screenshot.png';

    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    let url = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";

    await page.goto(url);

    await page.evaluate((a, b) => {
        document.querySelector('#ctl00_MainContent_txtID').value = a;
        document.querySelector('#ctl00_MainContent_txtUniqueID').value = b;
    }, input_id, input_code);

    const imgPart = (await page.$$eval('#ctl00_MainContent_imgSecNum', imgs => imgs.map(img => img.getAttribute('src'))))[0];
    const link = `http://hague.kdmid.ru/queue/${imgPart}`;
    console.log(link);

    scrShot("components/images/screenshot.png", () => {
        console.log("Screen-shot succeeded");

        Clipper(tempScreenShot, {canvas: Canvas}, function () {
            this.crop(770, 1270, 300, 100)
                .toFile(magicNumbersPath, function () {
                    visionAPI.fromFile(magicNumbersPath, setMagicNumbers(page));
                });
        });
    });
    // await browser.close();
})();

const setMagicNumbers = (page) => {
    return (number) => {
        console.log('nmber = ' + number);
        (async () => {
            await page.evaluate((a) => {
                document.querySelector('#ctl00_MainContent_txtCode').value = a;
                console.log(a);
            }, number);

            await clickButton('#ctl00_MainContent_ButtonA', page)();
            await clickCheckbox('#ctl00_MainContent_CheckBoxList1_0', page)();
            await clickButton('#ctl00_MainContent_ButtonQueue', page)();
        })();
    }
};

const clickButton = (selector, page) => {
    return async () => {
        const element = (await page.$$(selector))[0];

        await Promise.all([
            page.waitForNavigation(),
            element.click({delay: 100})
        ]);
    }
};

const clickCheckbox = (selector, page) => {
    return async () => {
        const element = (await page.$$(selector))[0];

        await Promise.all([
            element.click({delay: 100})
        ]);
    }
};
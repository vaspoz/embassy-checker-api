const puppeteer = require('puppeteer');
const visionAPI = require('./visionAPI');
const Clipper = require('image-clipper');
const Canvas = require('canvas');
const scrShot = require('desktop-screenshot');
const bird = require('./messageBird');

module.exports = () => {
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
                        visionAPI.fromFile(magicNumbersPath, setMagicNumbers(page, browser));
                    });
            });
        });
    })();
};

const setMagicNumbers = (page, browser) => {
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

            const element = (await page.$$("label[for='ctl00_MainContent_RadioButtonList1_0'"))[0];
            await page.evaluate(element => {
                return element.innerText
            }, element).then(text => {
                let firstPossibleDate = text.split(' ')[0];
                console.log('first possible date is: ' + firstPossibleDate);

                bird('First possible date is: ' + firstPossibleDate);

            });

            await browser.close();

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
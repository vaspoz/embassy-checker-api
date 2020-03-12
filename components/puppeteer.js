const puppeteer = require('puppeteer');
const visionAPI = require('./visionAPI');
const Jimp = require('jimp');

module.exports = (setEarliestDateCallback, wrongNumberCallback) => {
    (async () => {
        const input_id = '38704';
        const input_code = '24E6A7C7';

        const magicNumbersPath = 'components/images/magicNumbers.png';
        const tempScreenShot = 'components/images/screenshot.png';

        const browser = await puppeteer.launch({headless: false});

        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);
        let url = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";

        await page.goto(url);

        await page.screenshot({path: tempScreenShot});

        await page.evaluate((a, b) => {
            document.querySelector('#ctl00_MainContent_txtID').value = a;
            document.querySelector('#ctl00_MainContent_txtUniqueID').value = b;
        }, input_id, input_code);

        Jimp.read(tempScreenShot)
            .then(lenna => {
                console.log('Start cropping..');
                return lenna
                    .crop(350, 450, 170, 50)    //770, 1270, 300, 100 (for mac)
                    .write(magicNumbersPath); // save
            })
            .then(() => {
                visionAPI.fromFile(magicNumbersPath, setMagicNumbers(page, browser, setEarliestDateCallback, wrongNumberCallback));
            });

    })();
};

const setMagicNumbers = (page, browser, setEarliestDateCallback, wrongNumberCallback) => {
    return (number) => {
        number = number.substr(0,6);
        if (!validateRecognizedDigits(number)) {
            browser.close();
            wrongNumberCallback(number);
            return;
        }
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
                setEarliestDateCallback(firstPossibleDate);

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

const validateRecognizedDigits = (strNumber) => {
    let numbers = /^[0-9]+$/;
    return !!((strNumber.match(numbers)) && (strNumber.length === 6));
};
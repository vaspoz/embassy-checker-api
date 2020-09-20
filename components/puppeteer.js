const puppeteer = require('puppeteer');
const visionAPI = require('./visionAPI');
const Jimp = require('jimp');

module.exports = (configuration, setEarliestDateCallback, wrongNumberCallback, exceptionHandling) => {
    (async () => {
        const {secretCode, requestID} = configuration;
        const input_id = requestID;
        const input_code = secretCode;

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
                visionAPI.fromFile(magicNumbersPath, setMagicNumbers(page, browser, setEarliestDateCallback, wrongNumberCallback, exceptionHandling));
            });

    })();
};

const setMagicNumbers = (page, browser, setEarliestDateCallback, wrongNumberCallback, exceptionHandling) => {
    return (number) => {
        number = number.substr(0, 6);
        if (!validateRecognizedDigits(number)) {
            browser.close();
            wrongNumberCallback(number);
            return;
        }
        console.log('magic number = ' + number);
        (async () => {
            await page.evaluate((a) => {
                document.querySelector('#ctl00_MainContent_txtCode').value = a;
                console.log(a);
            }, number);

            let result;
            result = await clickButton('#ctl00_MainContent_ButtonA', page, exceptionHandling)();
            if (!result) {
                await browser.close();
                return;
            }
            result = await clickCheckbox('#ctl00_MainContent_CheckBoxList1_0', page, exceptionHandling)();
            if (!result) {
                await browser.close();
                return;
            }
            result = await clickButton('#ctl00_MainContent_ButtonQueue', page, exceptionHandling)();
            if (!result) {
                await browser.close();
                return;
            }

            const element = (await page.$$("label[for='ctl00_MainContent_RadioButtonList1_0'"))[0];
            await page.evaluate(element => {
                return element.innerText
            }, element).then(text => {
                let firstPossibleDate = text.split(' ')[0];
                setEarliestDateCallback(firstPossibleDate);
            });

            await browser.close();

        })();
    }
};

const clickButton = (selector, page, exceptionHandling) => {
    return async () => {
        const element = (await page.$$(selector))[0];

        await Promise.all([
            page.waitForNavigation(),
            element.click({delay: 100})
        ]).catch((error) => {
            console.log(error);
            exceptionHandling(error);
            return false;
        });
        return true;
    }
};

const clickCheckbox = (selector, page, exceptionHandling) => {
    return async () => {
        const element = (await page.$$(selector))[0];

        await Promise.all([
            element.click({delay: 100})
        ]).catch((error) => {
                console.log(error);
                exceptionHandling(error);
                return false;
            }
        );
        return true;
    }
};

const validateRecognizedDigits = (strNumber) => {
    let numbers = /^[0-9]+$/;
    return !!((strNumber.match(numbers)) && (strNumber.length === 6));
};

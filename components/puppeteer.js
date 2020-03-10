const puppeteer = require('puppeteer');
const visionAPI = require('./index');
const Clipper = require('image-clipper');
const Canvas = require('canvas');
const scrShot = require('desktop-screenshot');


(async () => {
    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    let url = "http://hague.kdmid.ru/queue/queuechng.aspx?ac=chng";
    // let url = "http://hague.kdmid.ru/";

    await page.goto(url);
    // await page.waitForSelector("#ctl00_MainContent_txtID");         //38704
    // await page.waitForSelector("#ctl00_MainContent_txtUniqueID");   //24E6A7C7
    // await page.waitForSelector("#ctl00_MainContent_txtCode");

    // let enterSiteLink = (await page.$$('a'))[0];   //get the main links
    //
    // await Promise.all([
    //     page.waitForNavigation(),
    //     enterSiteLink.click({delay: 100})
    // ]);

    // let's get the sub links
    // let changeTimeButton = (await page.$$('#LinkButtonB'))[0];
    //
    // await Promise.all([
    //     page.waitForNavigation(),
    //     changeTimeButton.click({delay: 100})
    // ]);

    await page.evaluate((a, b) => {
        document.querySelector('#ctl00_MainContent_txtID').value = a;
        document.querySelector('#ctl00_MainContent_txtUniqueID').value = b;
    }, '38704', '24E6A7C7');

    const imgPart = (await page.$$eval('#ctl00_MainContent_imgSecNum', imgs => imgs.map(img => img.getAttribute('src'))))[0];
    const link = `http://hague.kdmid.ru/queue/${imgPart}`;
    console.log(link);

    let magicNumbersPath = 'components/images/magicNumbers.png';
    scrShot("components/images/screenshot.png", () => {
        console.log("Screenshot succeeded");

        Clipper('components/images/screenshot.png', {canvas: Canvas}, function () {
            this.crop(770, 1270, 300, 100)
                .toFile(magicNumbersPath, function () {
                    visionAPI.fromFile(magicNumbersPath, (number) => {
                        console.log('nmber = ' + number);
                        (async () => {
                            await page.evaluate((a) => {
                                document.querySelector('#ctl00_MainContent_txtCode').value = a;
                                console.log(a);
                            }, number);
                        })();
                    })
                });
        });
    });
    // await browser.close();
})();

const setMagicNumbers = ({context}) => {

        return (number) => {
            console.log('nmber = ' + number);
            (async () => {
                await context.page.evaluate((a) => {
                    context.document.querySelector('#ctl00_MainContent_txtCode').value = a;
                    console.log(a);
                }, number);
            })();
        }
    }
;
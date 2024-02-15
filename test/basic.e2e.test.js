import { setDefaultOptions } from 'expect-puppeteer';
// import { expect as jestExpect } from '@jest/globals'
import puppeteer from 'puppeteer';


const dataChat = [
  { message: '1+0' }, { message: '2+0' }, { message: '3+0' }, { message: '4+0' }, { message: '5+0' }, { message: '6+0' }, { message: '7+0' }, { message: '8+0' }, { message: '9+0' }, { message: '10+0' },
  { message: '11+0' }, { message: '12+0' }, { message: '13+0' }, { message: '14+0' }, { message: '15+0' }, { message: '16+0' }, { message: '17+0' }, { message: '18+0' }, { message: '19+0' }, { message: '20+0' },
  { message: '21+0' }, { message: '22+0' }, { message: '23+0' }, { message: '24+0' }, { message: '25+0' }, { message: '26+0' }, { message: '27+0' }, { message: '28+0' }, { message: '29+0' }, { message: '30+0' },
  { message: '31+0' }, { message: '32+0' }, { message: '33+0' }, { message: '34+0' }, { message: '35+0' }, { message: '36+0' }, { message: '37+0' }, { message: '38+0' }, { message: '39+0' }, { message: '40+0' },
  { message: '41+0' }, { message: '42+0' }, { message: '43+0' }, { message: '44+0' }, { message: '45+0' }, { message: '46+0' }, { message: '47+0' }, { message: '48+0' }, { message: '49+0' }, { message: '50+0' }
];

const selectors = {
  inputSelector: 'div#app form textarea[enterkeyhint="send"]',
  btnSubmitSelector: 'div#app form button[type="submit"]',
  responseSelector: 'div#app div[role="presentation"] div.prose > *',

  btnConvLinks: 'div#app > div > nav:nth-child(3) > div:nth-child(2) a',

  btnDeleteRequest: 'button[title="Delete conversation"]',
  btnDeleteConfirm: 'button[title="Confirm delete action"]',
};

const homePageUrl = 'http://localhost:5173';

setDefaultOptions({ timeout: 2000 });

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    devtools: true,
    args: ['--window-size=1080,720']
  })
  page = await browser.newPage();
  await page.goto(homePageUrl);

});

afterAll(async () => {
  // await browser.close();

});

describe('Deleting convs does not freeze app', () => {

  // create new user to have 0 conversations from start
  // test('', () => {});

  test('Clicks Btn start chatting if it exists', async () => {

    // save this in /utils
    const findButtonByText = async text => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(btn => btn.textContent.includes(text));
    };

    const btnStartChatting = await page.evaluate(findButtonByText, 'Start chatting');

    if (btnStartChatting) {
      await expect(page).toClick('button', { text: 'Start chatting' });
    } else {
      await expect(page).toMatchElement('span', { text: 'ChatUI' });
    };

  });


  test(`adds ${dataChat.length} conversations`, async () => {

    // jestExpect.setTimeout(10000);
    const { inputSelector, btnSubmitSelector, responseSelector, btnConvLinks } = selectors;

    for (let i = 0; i < dataChat.length; i++) {
      // console.log('### dataChat[i].message: ', dataChat[i].message);

      await page.type(inputSelector, dataChat[i].message);

      await page.click(btnSubmitSelector);

      // await page.waitForSelector(responseSelector);

      // const responseText = await page.$eval(responseSelector, el => el.textContent);
      // console.log(`responseText: `, responseText);

      await page.goto(homePageUrl);
    };

    const totalConvLength = await page.$$eval(btnConvLinks, el => el.length);

    // debugger;
    // console.log(`totalConvLength: `, totalConvLength);
    await expect(totalConvLength).toEqual(dataChat.length);
    // console.log(`${dataChat.length} conversations added`);

    // done();

  }, 14000);


  test(`deletes ${dataChat.length} conversations`, async () => {
    const { btnConvLinks, btnDeleteRequest, btnDeleteConfirm } = selectors;

    // const totalConvLength = await page.$$eval(btnConvLinks, el => el.length);
    // div a:nth-child(2) button[title="Delete conversation"]
    // await page.click(`${btnConvLinks}:nth-child(2) ${btnDeleteRequest}`);

    // first conversation link
    await page.hover(`${btnConvLinks}:nth-child(2)`);
    await page.hover(`${btnConvLinks}:nth-child(2) ${btnDeleteRequest}`);
    // await page.click('div a:nth-child(2) button[title="Delete conversation"]');
    await page.click(`${btnConvLinks}:nth-child(2) ${btnDeleteRequest}`);

    for (let i = 0; i < dataChat.length; i++) {

      await page.click(`${btnConvLinks}:nth-child(2) ${btnDeleteConfirm}`);

      // expect(totalConvLength).toEqual(dataChat.length -i-1);

    };

    const totalConvLength = await page.$$eval(btnConvLinks, el => el.length);
    expect(totalConvLength).toEqual(0);
    // console.log('50 conversations deleted');

  }, 14000);


  test('app is not frozen', async () => {
    // DRY this

    const { inputSelector, btnSubmitSelector, responseSelector, btnConvLinks } = selectors;

    await page.type(inputSelector, dataChat[0].message);

    await page.click(btnSubmitSelector);

    // await page.waitForSelector(responseSelector);

    // const responseText = await page.$eval(responseSelector, el => el.textContent);
    // console.log(`responseText: `, responseText);

    const totalConvLength = await page.$$eval(btnConvLinks, el => el.length);

    await expect(totalConvLength).toEqual(1);

    // console.log('App is not frozen');

  });


});


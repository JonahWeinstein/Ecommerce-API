const puppeteer = require('puppeteer')

// globally scoped variables which are available in all tests
let page, browser;
jest.setTimeout(30000);

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false
    })
})

beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:8080')
}, 100000)

afterAll(async () => {
    await browser.close()
})

test('Clicking login button sends user to login form', async () => {
    await Promise.all([
        
        page.click('a[href="/login"]')
    ]);

    const url = await page.url();
    expect(url).toMatch('localhost:8080/login')
})

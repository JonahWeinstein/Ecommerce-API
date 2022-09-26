const puppeteer = require('puppeteer')

// globally scoped variables which are available in all tests
let page, browser;
jest.setTimeout(30000);

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: true
    })
})

beforeEach(async () => {
    page = await browser.newPage()
    await page.goto('http://localhost:8080')
})

afterAll(async () => {
    await browser.close()
})

test('Clicking login button sends user to login form', async () => {
    await page.click('a[href="/login"]')
    const url = await page.url();
    expect(url).toMatch('localhost:8080/login')
})

test('Clicking register button sends user to register form', async () => {
    await page.click('a[href="/register"]')
    const url = await page.url();
    expect(url).toMatch('localhost:8080/register')
})

test('clickling "sign in with google" button starts Oauth flow', async () => {
    
    await Promise.all([
        page.waitForNavigation(),
        page.click('a[href="/api/auth/google"]')
      ]);
    const url = await page.url();
    // test that clicking 'login with google' redirects to google login
    expect(url).toMatch(/accounts\.google\.com/);
});

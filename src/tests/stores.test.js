const puppeteer = require('puppeteer');
const { getContentsOf, getContentsOfArray, login } = require('./helpers/page');


// globally scoped variables which are available in all tests
let page, browser;


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

/* TESTS THAT REQUIRE LOGIN */
describe('User is logged in', () => {

    beforeEach(async () => {
        await login(page)
    })

    test('can see stores in nav', async () => {
        const stores = await getContentsOf(page, 'a[href="/UserDashboard"]')
        expect(stores).toEqual('Stores')
    })

    test('clicking add store redirects to add store form', async () => {
        await Promise.all([
            page.click('a[href="/UserDashboard/AddStore"]'),
            page.waitForNavigation()
        ])
        const text = await getContentsOf(page, 'p')
        expect(text).toEqual('Pick A Name For Your Store')
    })
    test('adding store works', async () => {

        await page.goto('http://localhost:8080/UserDashboard/AddStore')
        await page.type('form input', 'test store 2')
        await Promise.all([
            page.click('button[type=submit]'),
            // need to wait for selector for store list because it will load slightly after navigation
            page.waitForSelector('div.list__item')
        ])
        
        const storeNames = await getContentsOfArray(page, 'div.h1')
        
        expect(storeNames).toContain('test store 2')




    })
    test('deleting store shows delete modal', async () => {

        await page.goto('http://localhost:8080/UserDashboard')
        await page.waitForSelector('div.list__item')
        await Promise.all([
            // click on store to delete
            page.click('div.h1'),
            page.waitForSelector('button.cta')
        ])
        await page.click('button.button.delete-button')
        const text = await getContentsOf(page, 'button.button.cta')
        expect(text).toEqual('Nevermind')


    })

    test('deleting store works', async () => {
        await page.goto('http://localhost:8080/UserDashboard')
        await page.waitForSelector('div.list__item')
        await Promise.all([
            // click on store to delete
            page.click('div.h1'),
            page.waitForSelector('button.cta')
        ])
        // 
        await page.click('button.delete-button')
        
        await Promise.all([
            page.click('.modal button.delete-button'),
            // wait for addStore button (means we are back at store list)
            page.waitForSelector('a[href="/UserDashboard/AddStore"]')
        ])
        const storeNames = await getContentsOfArray(page, 'div.h1')
        expect(storeNames).not.toContain('testStore')
    })

})

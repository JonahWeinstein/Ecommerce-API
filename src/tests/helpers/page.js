const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');


   
    const getContentsOf = async (page, selector) => {
        return page.$eval(selector, el => el.innerHTML )
    }

    const login = async (page) => {
        const user = await userFactory('testUser', 'testUser@example.com', 'testPass')
        const {session, sig} = sessionFactory(user)
        await page.setCookie({ name: 'session', value: session });
        await page.setCookie({ name: 'session.sig', value: sig });
        await page.goto('http://localhost:8080/UserDashboard')
        await page.waitForSelector('a[href="/api/users/logout"]');
    }

module.exports = {
    getContentsOf,
    login
}


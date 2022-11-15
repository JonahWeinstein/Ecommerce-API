
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');


   
    const getContentsOf = (page, selector) => {
        return page.$eval(selector, el => el.innerHTML )
    }

    const getContentsOfArray = (page, selector) => {
        // page.$$eval calls callback with array of selector matches, storeNames will be array of innerHTML of all of them
        return page.$$eval(selector, (elements) => {
            return elements.map((element) => element.innerHTML)
            }
        )
    }

    const login = async (page) => {
        const user = await userFactory()
        const {session, sig} = sessionFactory(user)
        await page.setCookie({ name: 'session', value: session });
        await page.setCookie({ name: 'session.sig', value: sig });
        await page.goto('http://localhost:8080/UserDashboard')
        await page.waitForSelector('a[href="/api/users/logout"]');
    }

module.exports = {
    getContentsOf,
    getContentsOfArray,
    login
}


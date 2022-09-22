const Buffer = require('safe-buffer').Buffer;
const Keygrip = require('keygrip');

const keygrip = new Keygrip('123123');

module.exports = user => {
    // mimic how session object appears in our application
    // user._id will be javascript object (have to take string _id out)
    const sessionObject = { 
        passport: {
            user: user._id.toString()
        }
    };
    // base64 encode stringified sessionObject
    const session = Buffer.from(
        JSON.stringify(sessionObject))
        .toString('base64');
    // 'session='+sessionString is because thats how the cookies library expects it
    const sig = keygrip.sign('session=' + session);
    // return session and signature 
    return { session, sig }
};
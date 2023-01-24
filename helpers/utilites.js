const crypto = require('crypto');
const environment = require('./environments');

const utilities = {};

utilities.parseJSON = (jsonString) => {
    let output = {};
    console.log(jsonString);
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        console.log('From utilities ', error);
    }
    return output;
};

utilities.hash = (string) => {
    if (typeof string === 'string' && string.length > 0) {
        const hash = crypto
            .createHmac('sha256', environment.secretKey)
            .update(string)
            .digest('hex');
        return hash;
    }
    return false;
};

utilities.createToken = (strLen) => {
    const length = typeof strLen === 'number' && strLen > 0 ? strLen : false;
    if (length) {
        const possibleChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let output = '';
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < length; i++) {
            output += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return output;
    }
    return false;
};

module.exports = utilities;

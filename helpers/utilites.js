const crypto = require('crypto');
const environment = require('./environments');

const utilities = {};

utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        console.log(error);
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

module.exports = utilities;

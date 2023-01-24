/* eslint-disable operator-linebreak */
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments');

const notifications = {};

// send notification

notifications.sendTwilioSms = (phone, msg, callback) => {
    const userPhone =
        typeof phone === 'string' && phone.trim().length === 11 ? phone.trim() : false;
    const userMsg =
        typeof msg === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600
            ? msg.trim()
            : false;
    if (userPhone && userMsg) {
        // configure the request payload
        const payload = {
            Form: twilio.fromPhone,
            To: `+88${userPhone}`,
            Body: userMsg,
        };
        const stringifiedPayload = querystring.stringify(payload);
        // configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        // instantiate the request object
        const req = https.request(requestDetails, (res) => {
            // get the status code of sent message
            const { statusCode } = res;
            if (statusCode === 200 || statusCode === 201) {
                callback(false);
            } else {
                callback(`Status code ${statusCode}.`);
            }
        });
        req.on('error', (e) => {
            callback(e);
        });
        // send the request
        req.write(stringifiedPayload);
        req.end();
    } else {
        callback('Invalid phone or message');
    }
};

module.exports = notifications;

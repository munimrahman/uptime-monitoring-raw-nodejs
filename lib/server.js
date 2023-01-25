const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
const environment = require('../helpers/environments');

const server = {};
server.config = {};

server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);

    createServerVariable.listen(environment.port, () => {
        console.log(`Server running on port ${environment.port}`);
    });
};

server.handleReqRes = handleReqRes;

server.start = () => {
    server.createServer();
};

module.exports = server;
/*
Check database and twilio sms connection
// const { sendTwilioSms } = require('./helpers/notifications');

// eslint-disable-next-line no-unused-vars
// const data = require('./lib/data');
// testing file system
// data.create('test', 'newFile', { name: 'Munim Rahman', age: 28 }, (err) => {
//     console.log('Error: ', err);
// });

// data.update('test', 'newFile', { name: 'Shakib', age: 29 }, (err) => {
//     console.log('Error: ', err);
// });

// data.read('test', 'newFile', (err, result) => {
//     console.log(err, result);
// });

// data.delete('test', 'newFile', (err) => {
//     console.log('Error: ', err);
// });
// sendTwilioSms('01929645146', 'Hello World', (err) => {
//     console.log('Error: ', err);
// });
*/

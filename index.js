const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const { sendTwilioSms } = require('./helpers/notifications');

// eslint-disable-next-line no-unused-vars
const data = require('./lib/data');

const app = {};
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

app.config = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`Server running on port ${environment.port}`);
    });
};

app.handleReqRes = handleReqRes;
app.createServer();

const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');

const app = {};

app.config = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    server.listen(environment.port, () => {
        console.log(`Server running on port ${environment.port}`);
    });
};

app.handleReqRes = handleReqRes;
app.createServer();

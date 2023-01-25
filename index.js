const server = require('./lib/server');
const worker = require('./lib/workers');

const app = {};

app.init = () => {
    // start server
    server.start();
    // start the workers
    worker.start();
};

app.init();

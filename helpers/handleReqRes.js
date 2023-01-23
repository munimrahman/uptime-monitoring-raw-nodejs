const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilites');

const handler = {};

handler.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const headersObject = req.headers;
    const decoder = new StringDecoder('utf-8');
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryString,
        headersObject,
    };

    let realData = '';
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('end', () => {
        realData += decoder.end();
        requestProperties.body = parseJSON(realData);
        chosenHandler(requestProperties, (statusCode, payload) => {
            // eslint-disable-next-line no-param-reassign
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            // eslint-disable-next-line no-param-reassign
            payload = typeof payload === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handler;

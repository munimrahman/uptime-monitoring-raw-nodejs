const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, { message: 'Your Requested URL Not Found' });
};

module.exports = handler;

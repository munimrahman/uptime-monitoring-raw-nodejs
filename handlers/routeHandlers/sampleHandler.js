const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a Sample Route',
    });
};

module.exports = handler;

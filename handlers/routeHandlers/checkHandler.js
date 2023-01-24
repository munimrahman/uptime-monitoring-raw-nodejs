/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
const data = require('../../lib/data');
const { parseJSON, createToken } = require('../../helpers/utilites');
const tokenHandler = require('./tokenHandler');
const { maxChecks } = require('../../helpers/environments');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: `${requestProperties.method} is not allowed`,
        });
    }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // Validate the input
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].includes(requestProperties.body.protocol)
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;
    const successCode =
        typeof requestProperties.body.successCode === 'object' &&
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;
    const timeOutSeconds =
        typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5
            ? requestProperties.body.timeOutSeconds
            : false;

    if (protocol && url && method && successCode && timeOutSeconds) {
        // verify token
        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false;
        // look up user phone by reading token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                const userPhone = parseJSON(tokenData).phone;
                data.read('users', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        // verify the token
                        tokenHandler._token.verify(token, userPhone, (verifyToken) => {
                            if (verifyToken) {
                                // main process
                                const userObject = parseJSON(userData);
                                const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];
                                if (userChecks.length < maxChecks) {
                                    const checkId = createToken(20);
                                    const checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCode,
                                        timeOutSeconds,
                                    };
                                    // save the check object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            // add check id to user object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the user object
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, {
                                                        message: 'Check added successfully',
                                                        checkObject,
                                                    });
                                                } else {
                                                    callback(500, {
                                                        message: 'Check could not be added',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                message: 'Internal server error',
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        message: 'Too many checks',
                                    });
                                }
                            } else {
                                callback(403, {
                                    message: 'You are not authorized to access.',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            message: 'User Not Found',
                        });
                    }
                });
            } else {
                callback(404, {
                    message: 'Authentication failed',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Invalid input',
        });
    }
};

handler._check.get = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryString.id === 'string' &&
        requestProperties.queryString.id.trim().length === 20
            ? requestProperties.queryString.id
            : false;
    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // verify token
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (verifyToken) => {
                    if (verifyToken) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            message: 'You are not authorized to access',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'Check not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Problem In your query string',
        });
    }
};

handler._check.put = (requestProperties, callback) => {
    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    const protocol =
        typeof requestProperties.body.protocol === 'string' &&
        ['http', 'https'].includes(requestProperties.body.protocol)
            ? requestProperties.body.protocol
            : false;
    const url =
        typeof requestProperties.body.url === 'string' &&
        requestProperties.body.url.trim().length > 0
            ? requestProperties.body.url
            : false;
    const method =
        typeof requestProperties.body.method === 'string' &&
        ['GET', 'POST', 'PUT', 'DELETE'].includes(requestProperties.body.method)
            ? requestProperties.body.method
            : false;
    const successCode =
        typeof requestProperties.body.successCode === 'object' &&
        requestProperties.body.successCode instanceof Array
            ? requestProperties.body.successCode
            : false;
    const timeOutSeconds =
        typeof requestProperties.body.timeOutSeconds === 'number' &&
        requestProperties.body.timeOutSeconds % 1 === 0 &&
        requestProperties.body.timeOutSeconds >= 1 &&
        requestProperties.body.timeOutSeconds <= 5
            ? requestProperties.body.timeOutSeconds
            : false;
    if (id) {
        if (protocol || url || method || successCode || timeOutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    const checkObject = parseJSON(checkData);
                    // verify token
                    const token =
                        typeof requestProperties.headersObject.token === 'string'
                            ? requestProperties.headersObject.token
                            : false;
                    tokenHandler._token.verify(token, checkObject.userPhone, (verifyToken) => {
                        if (verifyToken) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }
                            if (url) {
                                checkObject.url = url;
                            }
                            if (method) {
                                checkObject.method = method;
                            }
                            if (successCode) {
                                checkObject.successCode = successCode;
                            }
                            if (timeOutSeconds) {
                                checkObject.timeOutSeconds = timeOutSeconds;
                            }
                            // update check object
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200, checkObject);
                                } else {
                                    callback(500, {
                                        message: 'Server error',
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                message: 'You are not authorized to access',
                            });
                        }
                    });
                } else {
                    callback(404, {
                        message: 'Check not found',
                    });
                }
            });
        } else {
            callback(400, {
                message: 'Must Provide One Field',
            });
        }
    } else {
        callback(400, {
            message: 'Invalid Request',
        });
    }
};

handler._check.delete = (requestProperties, callback) => {
    const id =
        typeof requestProperties.queryString.id === 'string' &&
        requestProperties.queryString.id.trim().length === 20
            ? requestProperties.queryString.id
            : false;
    if (id) {
        data.read('checks', id, (err, checkData) => {
            if (!err && checkData) {
                // verify token
                const token =
                    typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false;

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (verifyToken) => {
                    if (verifyToken) {
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read(
                                    'users',
                                    parseJSON(checkData).userPhone,
                                    (err3, userData) => {
                                        const userObject = parseJSON(userData);
                                        if (!err3 && userData) {
                                            const userChecks =
                                                typeof userObject.checks === 'object' &&
                                                userObject.checks instanceof Array
                                                    ? userObject.checks
                                                    : [];
                                            // remove the deleted checks from the user object
                                            const checkPosition = userChecks.indexOf(id);
                                            if (checkPosition > -1) {
                                                userChecks.splice(checkPosition, 1);
                                                userObject.checks = userChecks;
                                                data.update(
                                                    'users',
                                                    userObject.phone,
                                                    userObject,
                                                    (err4) => {
                                                        if (!err4) {
                                                            callback(200, {
                                                                message: 'Updated',
                                                            });
                                                        } else {
                                                            callback(500, {
                                                                message: 'Server error',
                                                            });
                                                        }
                                                        // eslint-disable-next-line comma-dangle
                                                    }
                                                );
                                            } else {
                                                callback(404, {
                                                    message: 'Check Id not found',
                                                });
                                            }
                                        } else {
                                            callback(500, {
                                                message: 'Internal Server Error',
                                            });
                                        }
                                        // eslint-disable-next-line prettier/prettier
                                    },
                                );
                            } else {
                                callback(400, {
                                    message: 'Server error',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            message: 'You are not authorized to access',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'Check not found',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Problem In your query string',
        });
    }
};

module.exports = handler;

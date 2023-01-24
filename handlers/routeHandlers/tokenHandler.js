/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilites');
const { createToken } = require('../../helpers/utilites');

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: `${requestProperties.method} is not allowed`,
        });
    }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.body.phone === 'string' &&
        requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;

    const password =
        typeof requestProperties.body.password === 'string' &&
        requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password);
            const user = { ...parseJSON(userData) };
            if (hashedPassword === user.password) {
                const tokenId = createToken(20);
                const expiresIn = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    tokenId,
                    expiresIn,
                };
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            message: 'Internal Server Error',
                        });
                    }
                });
            } else {
                callback(401, {
                    message: 'Wrong password',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Phone and Password are required',
        });
    }
};

handler._token.get = (requestProperties, callback) => {
    const tokenId =
        typeof requestProperties.queryString.tokenId === 'string' &&
        requestProperties.queryString.tokenId.trim().length === 20
            ? requestProperties.queryString.tokenId
            : false;
    if (tokenId) {
        // find the token
        data.read('tokens', tokenId, (err, result) => {
            const token = { ...parseJSON(result) };
            if (!err && token) {
                callback(200, token);
            } else {
                callback(404, { message: 'Token not found' });
            }
        });
    } else {
        callback(404, {
            message: 'Token not found',
        });
    }
};

// refresh the token
handler._token.put = (requestProperties, callback) => {
    const tokenId =
        typeof requestProperties.body.tokenId === 'string' &&
        requestProperties.body.tokenId.trim().length === 20
            ? requestProperties.body.tokenId
            : false;
    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );
    if (tokenId && extend) {
        // find the token
        data.read('tokens', tokenId, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) };
            if (token.expiresIn > Date.now()) {
                token.expiresIn = Date.now() + 60 * 60 * 1000;
                // store the updated token
                data.update('tokens', tokenId, token, (err2) => {
                    if (!err2) {
                        callback(200, token);
                    } else {
                        callback(500, {
                            message: 'Internal Server Error',
                        });
                    }
                });
            } else {
                callback(400, {
                    message: 'Token already expired',
                });
            }
        });
    } else {
        callback(404, {
            message: 'There was an error retrieving the token',
        });
    }
};

handler._token.delete = (requestProperties, callback) => {
    const tokenId =
        typeof requestProperties.queryString.tokenId === 'string' &&
        requestProperties.queryString.tokenId.trim().length === 20
            ? requestProperties.queryString.tokenId
            : false;
    if (tokenId) {
        data.read('tokens', tokenId, (error, result) => {
            if (!error && result) {
                data.delete('tokens', tokenId, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'Token deleted successfully',
                        });
                    } else {
                        callback(500, {
                            message: 'Internal Server Error',
                        });
                    }
                });
            } else {
                callback(500, { message: 'Internal Server Error' });
            }
        });
    } else {
        callback(400, {
            message: 'Invalid Token Number',
        });
    }
};

handler._token.verify = (tokenID, phone, callback) => {
    data.read('tokens', tokenID, (err, tokenData) => {
        const token = {
            ...parseJSON(tokenData),
        };
        if (!err && tokenData) {
            if (token.phone === phone && token.expiresIn > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};

module.exports = handler;

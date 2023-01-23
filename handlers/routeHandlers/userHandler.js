/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilites');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: `${requestProperties.method} is not allowed`,
        });
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    // eslint-disable-next-line operator-linebreak
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
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
    const tosAgreement =
        typeof requestProperties.body.tosAgreement === 'boolean' &&
        requestProperties.body.tosAgreement
            ? requestProperties.body.tosAgreement
            : false;
    // console.log(firstName, lastName, phone, password, tosAgreement);
    if (firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err) => {
            if (err) {
                const user = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                data.create('users', phone, user, (error) => {
                    if (!error) {
                        callback(201, {
                            message: 'User created successfully',
                        });
                    } else {
                        callback(500, {
                            message: 'Error creating user',
                        });
                    }
                });
            } else {
                callback(500, {
                    message: 'Error in Server Side',
                });
            }
        });
    } else {
        callback(400, {
            message: 'Please fill all fields.',
        });
    }
};

handler._users.get = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        // find the user
        data.read('users', phone, (err, result) => {
            const user = { ...parseJSON(result) };
            if (!err && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, { message: 'User not found' });
            }
        });
    } else {
        callback(404, {
            message: 'User not found',
        });
    }
};

handler._users.put = (requestProperties, callback) => {
    const firstName =
        typeof requestProperties.body.firstName === 'string' &&
        requestProperties.body.firstName.trim().length > 0
            ? requestProperties.body.firstName
            : false;
    const lastName =
        typeof requestProperties.body.lastName === 'string' &&
        requestProperties.body.lastName.trim().length > 0
            ? requestProperties.body.lastName
            : false;
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
    if (phone) {
        if (firstName || lastName || password) {
            data.read('users', phone, (err, result) => {
                const user = { ...parseJSON(result) };
                if (!err && result) {
                    if (firstName) {
                        user.firstName = firstName;
                    }
                    if (lastName) {
                        user.lastName = lastName;
                    }
                    if (firstName) {
                        user.password = hash(password);
                    }
                    data.update('users', phone, user, (error) => {
                        if (!error) {
                            callback(200, {
                                message: 'User updated successfully',
                            });
                        } else {
                            callback(500, { message: 'Internal Server Error' });
                        }
                    });
                } else {
                    callback(400, {
                        message: 'You have a problem in your request.',
                    });
                }
            });
        } else {
            callback(400, {
                message: 'You have a problem in your request.',
            });
        }
    } else {
        callback(400, {
            message: 'Invalid Phone Number',
        });
    }
};

handler._users.delete = (requestProperties, callback) => {
    const phone =
        typeof requestProperties.queryString.phone === 'string' &&
        requestProperties.queryString.phone.trim().length === 11
            ? requestProperties.queryString.phone
            : false;
    if (phone) {
        data.read('users', phone, (error, result) => {
            if (!error && result) {
                data.delete('users', phone, (err) => {
                    if (!err) {
                        callback(200, {
                            message: 'User deleted successfully',
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
            message: 'Invalid Phone Number',
        });
    }
};

module.exports = handler;

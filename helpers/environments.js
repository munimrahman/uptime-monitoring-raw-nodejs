const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'lksjh345la546sa6krsdfj5',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15153735187',
        accountSid: 'AC3b8fcb53812e61dc90f8a16c1dc94486',
        authToken: 'b025d0488bfddb5921ede0eb1a2c0429',
    },
};

environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'lksjh345la546sa6krsdfj5',
    maxChecks: 5,
    twilio: {
        fromPhone: '+15153735187',
        accountSid: 'AC3b8fcb53812e61dc90f8a16c1dc94486',
        authToken: 'b025d0488bfddb5921ede0eb1a2c0429',
    },
};

// determine which environment was passed

// eslint-disable-next-line operator-linebreak
const currentEnvironment =
    typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// eslint-disable-next-line operator-linebreak
const environmentToExport =
    typeof environment[currentEnvironment] === 'object'
        ? environment[currentEnvironment]
        : environment.staging;

module.exports = environmentToExport;

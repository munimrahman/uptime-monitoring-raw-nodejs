const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
};

environment.production = {
    port: 5000,
    envName: 'production',
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

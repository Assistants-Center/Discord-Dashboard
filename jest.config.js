/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'json', 'node'],
    testMatch: ['**/*.test.js'], // Only match .test.js files
};

module.exports = config;

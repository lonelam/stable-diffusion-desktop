/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transformIgnorePatterns: ['node_modules/(?!chalk)'],
};

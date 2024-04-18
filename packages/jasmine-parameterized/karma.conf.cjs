const path = require('path');
const baseConfigFunction = require('@ni-private/karma-config');

const basePath = path.resolve(__dirname);

module.exports = config => {
    baseConfigFunction(config, false);

    config.set({
        basePath
    });
};

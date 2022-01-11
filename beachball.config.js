const path = require('path');
const lockPath = path.resolve(__dirname, './package-lock.json');
const { createPostbump } = require('@ni/beachball-lock-update');

module.exports = {
    hooks: {
        postbump: createPostbump(lockPath)
    }
};

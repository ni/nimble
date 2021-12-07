const path = require('path');
const fs = require('fs');
const os = require('os');

// Workaround for the following issues:
// Beachball issue: https://github.com/microsoft/beachball/issues/525
// NPM issue 1: https://github.com/npm/cli/issues/3756
// NPM issue 2: https://github.com/npm/cli/issues/3757

/**
 * Returns a beachball postbump hook implementation that bumps package
 * references specified in the root package-lock.json file during
 * beachball package version bumps.
 */
const postbump = (_packagePath, packageName, packageVersion) => {
    console.log(`Updating lockfile for package ${packageName} to version ${packageVersion}`);
    const lockPath = path.resolve(__dirname, './package-lock.json');

    console.log(`Lockfile to update: ${lockPath}`);
    const lockFile = JSON.parse(fs.readFileSync(lockPath));

    const isObject = function (obj) {
        return typeof obj === 'object' && obj !== null;
    };
    const recurseProperties = (currentValue, path) => {
        if (Array.isArray(currentValue)) {
            currentValue.forEach((value, i) => recurseProperties(value, [...path, `[${i}]`]));
        } else if (isObject(currentValue)) {
            const keys = Object.keys(currentValue);
            keys.forEach(key => {
                const value = currentValue[key];
                if (typeof value === 'string') {
                    if (key === packageName) {
                        // "@awesome/package": "^1.2.3-beta.4"
                        // Note: Uses a hard coded semantic range specifier
                        const update = `^${packageVersion}`;
                        console.log(`Updating lockfile path (${[...path, key].join(' > ')}) to value ${update}.`);
                        currentValue[key] = update;
                    } else if (key === 'version' && currentValue.name === packageName) {
                        // "name": "@awesome/package",
                        // "version": "1.2.3-beta.4"
                        const update = packageVersion;
                        console.log(`Updating lockfile path (${[...path, key].join(' > ')}) to value ${update}.`);
                        currentValue[key] = update;
                    } else {
                        // don't care about other string values
                        return;
                    }
                } else {
                    recurseProperties(currentValue[key], [...path, key]);
                }
            })
        } else {
            // Don't care about primitives at this point
            // Only care about string keys on an object
            return;
        }
    };
    recurseProperties(lockFile, []);

    console.log(`Serializing and writing lockfile for package ${packageName}`);
    const updatedLockFileJSON = JSON.stringify(lockFile, null, 2) + '\n';
    updatedLockFileJSONNewLines = updatedLockFileJSON.split('\n').join(os.EOL);
    fs.writeFileSync(lockPath, updatedLockFileJSONNewLines);

    console.log(`Updated lockfile for package ${packageName}`);
};

module.exports = {
    hooks: {
        postbump
    }
};

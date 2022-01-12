const fs = require('fs');
const os = require('os');

// Workaround for the following issues:
// Beachball issue: https://github.com/microsoft/beachball/issues/525
// NPM issue 1: https://github.com/npm/cli/issues/3756
// NPM issue 2: https://github.com/npm/cli/issues/3757

/**
 * Returns a beachball postbump hook implementation that bumps package
 * references specified in the target package-lock.json file during
 * beachball package version bumps.
 */
const createPostbump = packageLockPath => {
    return (_packagePath, packageName, packageVersion) => {
        console.log(`Updating lockfile for package ${packageName} to version ${packageVersion}`);
        console.log(`Lockfile to update: ${packageLockPath}`);
        const lockFile = JSON.parse(fs.readFileSync(packageLockPath));

        const formatJSONPath = jsonPath => jsonPath.flat(Infinity).join(' > ');
        const isObject = obj => typeof obj === 'object' && obj !== null;
        const recurseValues = (currentValue, jsonPath) => {
            if (Array.isArray(currentValue)) {
                currentValue.forEach((value, i) => recurseValues(value, [jsonPath, `[${i}]`]));
            } else if (isObject(currentValue)) {
                for (const [key, value] of Object.entries(currentValue)) {
                    if (typeof value === 'string') {
                        if (key === packageName) {
                            // Package dependency
                            // "@awesome/package": "^1.2.3-beta.4"
                            // Note: Ignore if package dependency version is '*' (used in monorepos for private packages declaring dependencies)
                            if (currentValue[key] === '*') {
                                console.log(`Skipping update for lockfile path with wildcard version (${formatJSONPath(jsonPath)}) {"${key}":"${currentValue[key]}"}`);
                            } else {
                                // Note: Uses a hard coded semantic range specifier
                                const update = `^${packageVersion}`;
                                console.log(`Updating lockfile path (${formatJSONPath(jsonPath)}) from {"${key}":"${currentValue[key]}"} to {"${key}":"${update}"}.`);
                                currentValue[key] = update;
                            }
                        } else if (key === 'version' && currentValue.name === packageName) {
                            // Package definition
                            // "name": "@awesome/package",
                            // "version": "1.2.3-beta.4"
                            const update = packageVersion;
                            console.log(`Updating lockfile path (${formatJSONPath(jsonPath)}) from {"name":"${packageName}","version":"${currentValue[key]}"} to {"name":"${packageName}","version":"${update}"}.`);
                            currentValue.version = update;
                        } else {
                            // ignore other string values
                        }
                    } else {
                        recurseValues(currentValue[key], [jsonPath, key]);
                    }
                }
            } else {
                // ignore primitives at this point
                // Only care about string keys on an object
            }
        };
        recurseValues(lockFile, []);

        console.log(`Serializing and writing lockfile for package ${packageName}`);
        const updatedLockFileJSON = `${JSON.stringify(lockFile, null, 2)}\n`;
        const updatedLockFileJSONNewLines = updatedLockFileJSON.split('\n').join(os.EOL);
        fs.writeFileSync(packageLockPath, updatedLockFileJSONNewLines);

        console.log(`Updated lockfile for package ${packageName}`);
    };
};

module.exports = {
    createPostbump
};
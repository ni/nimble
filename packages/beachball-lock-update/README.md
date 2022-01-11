<div align="center">
    <p><b>ni | beachball lock update</b></p>
</div>

# Beachball lock update

[![NPM Version](https://img.shields.io/npm/v/@ni/beachball-lock-update.svg)](https://www.npmjs.com/package/@ni/beachball-lock-update)

A tool to use [beachball](https://microsoft.github.io/beachball/) with npm monorepos. Specifically to workaround [beachball issue #525](https://github.com/microsoft/beachball/issues/525).

This package provides a beachball `postbump` hook implementation that bumps the versions of package references inside a `package-lock.json` file during beachball's publish step.

Note: This package does a simple search and replace inside the `package-lock.json` file. Plan to update the script if it does not leave the `package-lock.json` in an expected state.

## Getting Started

1. Install the package with `npm i -D @ni/beachball-lock-update`.
2. Integrate [beachball](https://microsoft.github.io/beachball/overview/getting-started.html) in your application.

   Note: This tool requires beachball >= v2.20.0 to leverage the `postbump` hook (this is represented in the `peerDependencies` of the package).
3. In a [beachball configuration file](https://microsoft.github.io/beachball/overview/configuration.html#configuration-files) add a bostbump hook using `@ni/beachball-lock-update`:
   ```js
    const path = require('path');
    const lockPath = path.resolve(__dirname, './package-lock.json');
    const { createPostbump } = require('@ni/beachball-lock-update');

    module.exports = {
        hooks: {
            postbump: createPostbump(lockPath)
        }
    };
    ```
4. Enjoy!

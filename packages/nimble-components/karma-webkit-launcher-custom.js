/**
 * @fileoverview Karma Webkit Launcher
 *
 * @license Copyright 2021 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

const child_process = require('child_process');
const os = require('os');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const isCI = require('is-ci');

/**
 * @return {string}
 */
function getTempDir() {
    return path.join(os.tmpdir(), uuidv4());
}

/**
 * @return {boolean}
 */
const isPlaywrightAvailable = function () {
    try {
        if (require.resolve('playwright')) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
};

/**
 * @return {boolean}
 */
const isPlaywrightCoreAvailable = function () {
    try {
        if (require.resolve('playwright-core')) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
};

/**
 * @return {boolean}
 */
const isPlaywrightWebkitAvailable = function () {
    try {
        if (require.resolve('playwright-webkit')) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
};

/**
 * @return {String}
 */
const getPlaywrightExecutable = function () {
    if (isPlaywrightAvailable()) {
        const playwright = require('playwright');
        return playwright.webkit.executablePath();
    } if (isPlaywrightWebkitAvailable()) {
        const playwright = require('playwright-webkit');
        return playwright.webkit.executablePath();
    } if (isPlaywrightCoreAvailable()) {
        const playwright = require('playwright-core');
        return playwright.webkit.executablePath();
    }
};

/**
 * @return {String}
 */
const getWebkitExecutable = function () {
    if (
        isPlaywrightAvailable()
        || isPlaywrightWebkitAvailable()
        || isPlaywrightCoreAvailable()
    ) {
        return getPlaywrightExecutable();
    }
    /*
     if (process.platform == 'darwin') {
        return '/usr/bin/osascript';
    }
    */
    return '';
};

/**
 * @return {boolean}
 */
const hasSafariEnv = function () {
    return (
        process.env && process.env.SAFARI_BIN && process.env.SAFARI_BIN != ''
    );
};

/**
 * @return {boolean}
 */
const hasWebkitEnv = function () {
    return (
        process.env && process.env.WEBKIT_BIN && process.env.WEBKIT_BIN != ''
    );
};

/**
 * @return {boolean}
 */
const hasWebkitHeadlessEnv = function () {
    return (
        process.env
        && process.env.WEBKIT_HEADLESS_BIN
        && process.env.WEBKIT_HEADLESS_BIN != ''
    );
};

/**
 * @param {String} url
 * @param {String} test_browser
 * @return {URL}
 */
const addTestBrowserInformation = function (url, test_browser) {
    const newURL = new URL(url);
    newURL.searchParams.append('test_browser', test_browser);
    return newURL;
};

/* omitted: SafariBrowser */

/**
 * Webkit Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const WebkitBrowser = function (baseBrowserDecorator, args) {
    // Automatically switch to Safari, if osascript is used and not headless mode.
    if (
        (args && args.flags
            ? !args.flags.join(' ').includes('--headless')
            : true)
        && process.platform == 'darwin'
        && !hasWebkitEnv()
        && getWebkitExecutable().endsWith('osascript')
    ) {
        SafariBrowser.call(this, baseBrowserDecorator, args);
        return;
    }

    baseBrowserDecorator(this);
    let testUrl;

    this._start = url => {
        const command = this._getCommand();

        // Add used browser to test url.
        if (command && command.includes('ms-playwright')) {
            testUrl = addTestBrowserInformation(url, 'Playwright');
        } else {
            testUrl = addTestBrowserInformation(url, 'Custom');
        }

        const flags = args.flags || [];
        this._execCommand(
            this._getCommand(),
            [testUrl, `--user-data-dir=${getTempDir()}`].concat(flags)
        );
    };

    this.on('kill', done => {
        childProcessCleanup(this.id, done);
    });

    this.on('done', () => {
        childProcessCleanup(this.id);
    });
};

WebkitBrowser.prototype = {
    name: 'Webkit',
    DEFAULT_CMD: {
        linux: !hasWebkitEnv() ? getPlaywrightExecutable() : '',
        darwin: !hasWebkitEnv() ? getWebkitExecutable() : '',
        win32: !hasWebkitEnv() ? getPlaywrightExecutable() : ''
    },
    ENV_CMD: 'WEBKIT_BIN'
};

WebkitBrowser.$inject = ['baseBrowserDecorator', 'args'];

/**
 * Webkit Headless Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const WebkitHeadlessBrowser = function (baseBrowserDecorator, args) {
    const headlessFlags = ['--headless'];
    if (process.platform == 'darwin' || process.platform == 'win32') {
        headlessFlags.push('--disable-gpu');
    }
    if (args && args.flags && args.flags.length > 0) {
        args.flags = args.flags.concat(headlessFlags);
    } else {
        args = {};
        args.flags = headlessFlags;
    }
    WebkitBrowser.call(this, baseBrowserDecorator, args);
};

WebkitHeadlessBrowser.prototype = {
    name: 'WebkitHeadless',
    DEFAULT_CMD: {
        linux: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : '',
        darwin: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : '',
        win32: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : ''
    },
    ENV_CMD: 'WEBKIT_HEADLESS_BIN'
};

WebkitHeadlessBrowser.$inject = ['baseBrowserDecorator', 'args'];

/* omitted: EpiphanyBrowser */
/* omitted: closeSafariTab */

/**
 * Cleans up child processes related to the Playwright task ID.
 * @param {number} task_id - The task ID to search for.
 * @param {function} callback - An optional callback function to execute after cleanup.
 */
const childProcessCleanup = function (task_id, callback) {
    const isCallbackDefined = callback && typeof callback === 'function';

    if (process.platform !== 'darwin' && process.platform !== 'linux') {
        if (isCallbackDefined) {
            callback();
        }
        return;
    }

    // Find all related child process for playwright based on the task id.
    console.log('Looking for Playwright child processes');
    const findChildProcesses = `ps | grep -i "playwright" | grep -i "id=${task_id}"`;
    child_process.exec(findChildProcesses, (error, stdout) => {
        // Ignore error from killed karma processes.
        if (error && error.signal != 'SIGHUP') {
            throw error;
        }

        // Check process list for relevant entries.
        if (
            stdout
            && stdout.toLowerCase().includes('playwright')
            && stdout.includes(task_id)
        ) {
            // Extract relevant child process ids.
            const childProcessIds = stdout.match(/^\s?(\d)+\s?/gm);
            if (childProcessIds && childProcessIds.length > 0) {
                killChildProcesses(childProcessIds, task_id);

                // Allow 500ms for the processes to close before calling the callback.
                if (isCallbackDefined) {
                    setTimeout(callback, 500);
                }
            } else if (isCallbackDefined) {
                callback();
            }
        } else if (isCallbackDefined) {
            callback();
        }
    });
};

/**
 * @param {Array} childProcessIds
 * @param {String} task_id
 */
const killChildProcesses = function (childProcessIds, task_id = 'unknown') {
    if (!childProcessIds || childProcessIds.length <= 0) {
        return;
    }

    console.log('childProcessIds', JSON.stringify(childProcessIds));

    childProcessIds.forEach(childProcessId => {
        // Check if the process is still valid with a 0 kill signal.
        try {
            process.kill(childProcessId, 0);
        } catch (error) {
            if (error.code === 'EPERM') {
                console.error(
                    `No permission to kill child process ${childProcessId} for karma-task ${task_id}`
                );
            }
            return;
        }

        // Killing child process, if there are no permission error.
        try {
            process.kill(childProcessId, 'SIGHUP');
        } catch (killError) {
            // Ignore errors if process is already killed.
            if (killError.code != 'ESRCH') {
                throw killError;
            }
        }
    });
};

module.exports = {
    'launcher:CustomWebkit': ['type', WebkitBrowser],
    'launcher:CustomWebkitHeadless': ['type', WebkitHeadlessBrowser]
};

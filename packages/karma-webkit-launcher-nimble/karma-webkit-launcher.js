/**
 * [Nimble]
 * Copied from https://github.com/google/karma-webkit-launcher/blob/d22498bb96a59c1e13090771e2cdd02daf6f17d0/index.js
 * with the following modifications:
 * - treat CI as false (skips a console warning and allows a Darwin-only cleanup function to run)
 * - kill orphaned MiniBrowser processes if the platform is Linux (i.e. CI builds)
 */

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

const child_process = require("child_process");
const os = require("os");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// [Nimble] There really isn't a need to check for CI environments (and we'd rather not depend on is-ci), so we'll just set it to false.
const isCI = false;
// const isCI = require("is-ci");

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
    if (require.resolve("playwright")) {
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
    if (require.resolve("playwright-core")) {
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
    if (require.resolve("playwright-webkit")) {
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
    const playwright = require("playwright");
    return playwright.webkit.executablePath();
  } else if (isPlaywrightWebkitAvailable()) {
    const playwright = require("playwright-webkit");
    return playwright.webkit.executablePath();
  } else if (isPlaywrightCoreAvailable()) {
    const playwright = require("playwright-core");
    return playwright.webkit.executablePath();
  }
};

/**
 * @return {String}
 */
const getWebkitExecutable = function () {
  if (
    isPlaywrightAvailable() ||
    isPlaywrightWebkitAvailable() ||
    isPlaywrightCoreAvailable()
  ) {
    return getPlaywrightExecutable();
  } else if (process.platform == "darwin") {
    return "/usr/bin/osascript";
  }
  return "";
};

/**
 * @return {boolean}
 */
const hasSafariEnv = function () {
  return process.env && process.env.SAFARI_BIN && process.env.SAFARI_BIN != "";
};

/**
 * @return {boolean}
 */
const hasWebkitEnv = function () {
  return process.env && process.env.WEBKIT_BIN && process.env.WEBKIT_BIN != "";
};

/**
 * @return {boolean}
 */
const hasWebkitHeadlessEnv = function () {
  return (
    process.env &&
    process.env.WEBKIT_HEADLESS_BIN &&
    process.env.WEBKIT_HEADLESS_BIN != ""
  );
};

/**
 * @param {String} url
 * @param {String} test_browser
 * @return {URL}
 */
const addTestBrowserInformation = function (url, test_browser) {
  const newURL = new URL(url);
  newURL.searchParams.append("test_browser", test_browser);
  return newURL;
};

/**
 * Safari Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const SafariBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this);
  let testUrl;

  this._start = (url) => {
    const flags = args.flags || [];
    const command = this._getCommand();
    testUrl = addTestBrowserInformation(url, "Safari");
    if (command && command.endsWith("osascript")) {
      if (process.platform != "darwin") {
        console.warn(
          `The platform ${process.platform}, is unsupported for SafariBrowser.`
        );
      }
      if (isCI) {
        console.warn(
          `Depending on the CI system, it could be that you need to disable SIP to allow the execution of AppleScripts!`
        );
      }
      this._execCommand(
        this._getCommand(),
        [path.resolve(__dirname, "scripts/LaunchSafari.scpt"), testUrl].concat(
          flags
        )
      );
    } else {
      this._execCommand(
        this._getCommand(),
        [testUrl, "--user-data-dir=" + getTempDir()].concat(flags)
      );
    }
  };

  this.on("kill", (done) => {
    // Close opened tabs if open by osascript.
    if (
      process.platform == "darwin" &&
      this._getCommand().endsWith("osascript")
    ) {
      closeSafariTab(testUrl);
    }
    done();
  });

  this.on("done", () => {
    // Close opened tabs if open by osascript.
    if (
      process.platform == "darwin" &&
      this._getCommand().endsWith("osascript")
    ) {
      closeSafariTab(testUrl);
    }
  });
};

SafariBrowser.prototype = {
  name: "Safari",
  DEFAULT_CMD: {
    darwin: !hasSafariEnv() ? "/usr/bin/osascript" : "",
  },
  ENV_CMD: "SAFARI_BIN",
};

SafariBrowser.$inject = ["baseBrowserDecorator", "args"];

/**
 * Webkit Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const WebkitBrowser = function (baseBrowserDecorator, args) {
  // Automatically switch to Safari, if osascript is used and not headless mode.
  if (
    (args && args.flags
      ? !args.flags.join(" ").includes("--headless")
      : true) &&
    process.platform == "darwin" &&
    !hasWebkitEnv() &&
    getWebkitExecutable().endsWith("osascript")
  ) {
    SafariBrowser.call(this, baseBrowserDecorator, args);
    return;
  }

  baseBrowserDecorator(this);
  let testUrl;

  this._start = (url) => {
    const command = this._getCommand();

    // Add used browser to test url.
    if (command && command.includes("ms-playwright")) {
      testUrl = addTestBrowserInformation(url, "Playwright");
    } else {
      testUrl = addTestBrowserInformation(url, "Custom");
    }

    const flags = args.flags || [];
    this._execCommand(
      this._getCommand(),
      [testUrl, "--user-data-dir=" + getTempDir()].concat(flags)
    );
  };

  this.on("kill", (done) => {
    // [Nimble] On our (linux) build machines, the bash process that starts the browser exits
    // without terminating it. Kill it to keep it from hanging around and causing problems.
    if (process.platform === "linux") {
      killOrphanedMiniBrowser(done);
      return;
    }
    // Clean up all remaining processes after 500ms delay on normal clients.
    if (!isCI) {
      childProcessCleanup(this.id, done);
    } else {
      done();
    }
  });

  this.on("done", () => {
    // Clean up all remaining processes after 500ms delay on normal clients.
    if (!isCI) {
      childProcessCleanup(this.id);
    }
  });
};

WebkitBrowser.prototype = {
  name: "Webkit",
  DEFAULT_CMD: {
    linux: !hasWebkitEnv() ? getPlaywrightExecutable() : "",
    darwin: !hasWebkitEnv() ? getWebkitExecutable() : "",
    win32: !hasWebkitEnv() ? getPlaywrightExecutable() : "",
  },
  ENV_CMD: "WEBKIT_BIN",
};

WebkitBrowser.$inject = ["baseBrowserDecorator", "args"];

/**
 * Webkit Headless Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const WebkitHeadlessBrowser = function (baseBrowserDecorator, args) {
  const headlessFlags = ["--headless"];
  if (process.platform == "darwin" || process.platform == "win32") {
    headlessFlags.push("--disable-gpu");
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
  name: "WebkitHeadless",
  DEFAULT_CMD: {
    linux: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : "",
    darwin: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : "",
    win32: !hasWebkitHeadlessEnv() ? getPlaywrightExecutable() : "",
  },
  ENV_CMD: "WEBKIT_HEADLESS_BIN",
};

WebkitHeadlessBrowser.$inject = ["baseBrowserDecorator", "args"];

/**
 * Epiphany Browser definition.
 * @param {*} baseBrowserDecorator
 * @param {*} args
 */
const EpiphanyBrowser = function (baseBrowserDecorator, args) {
  baseBrowserDecorator(this);
  let testUrl;

  this.on("start", (url) => {
    testUrl = addTestBrowserInformation(url, "Epiphany");
    const flags = args.flags || [];
    this._execCommand(
      this._getCommand(),
      [testUrl, "--profile=" + getTempDir()].concat(flags)
    );
  });
};

EpiphanyBrowser.prototype = {
  name: "Epiphany",
  DEFAULT_CMD: {
    linux: "/usr/bin/epiphany",
  },
  ENV_CMD: "EPIPHANY_BIN",
};

EpiphanyBrowser.$inject = ["baseBrowserDecorator", "args"];

/**
 * @param {string} url
 */
const closeSafariTab = function (url) {
  if (!url || url == "") {
    return;
  }
  const findChildProcesses = `osascript ${path.resolve(
    __dirname,
    "scripts/CloseSafariTab.scpt"
  )} "${url}"`;
  child_process.exec(findChildProcesses, (error) => {
    if (error && error.signal != "SIGHUP") {
      throw error;
    }
  });
};

/**
 * Cleans up child processes related to the Playwright task ID.
 * @param {number} task_id - The task ID to search for.
 * @param {function} callback - An optional callback function to execute after cleanup.
 */
const childProcessCleanup = function (task_id, callback) {
  const isCallbackDefined = callback && typeof callback === "function";

  if (process.platform !== "darwin") {
    if (isCallbackDefined) {
      callback();
    }
    return;
  }

  // Find all related child process for playwright based on the task id.
  const findChildProcesses = `ps | grep -i "playwright" | grep -i "id=${task_id}"`;
  child_process.exec(findChildProcesses, (error, stdout) => {
    // Ignore error from killed karma processes.
    if (error && error.signal != "SIGHUP") {
      throw error;
    }

    // Check process list for relevant entries.
    if (
      stdout &&
      stdout.toLowerCase().includes("playwright") &&
      stdout.includes(task_id)
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
const killChildProcesses = function (childProcessIds, task_id = "unknown") {
  if (!childProcessIds || childProcessIds.length <= 0) {
    return;
  }

  childProcessIds.forEach((childProcessId) => {
    // Check if the process is still valid with a 0 kill signal.
    try {
      process.kill(childProcessId, 0);
    } catch (error) {
      if (error.code === "EPERM") {
        console.error(
          `No permission to kill child process ${childProcessId} for karma-task ${task_id}`
        );
      }
      return;
    }

    // Killing child process, if there are no permission error.
    try {
      process.kill(childProcessId, "SIGHUP");
    } catch (killError) {
      // Ignore errors if process is already killed.
      if (killError.code != "ESRCH") {
        throw killError;
      }
    }
  });
};

// [Nimble] Added function to kill orphaned MiniBrowser processes on Linux.
const killOrphanedMiniBrowser = function (callback) {
  // The ps call's output is formatted as follows:
  // PID     PPID COMMAND
  // 8686       1 MiniBrowser
  // A parent process id of 1 indicates it was orphaned
  child_process.exec('ps -eo pid,ppid,comm | grep -w "1 MiniBrowser"', (error, stdout) => {
    if (error) {
      throw error;
    }

    if (stdout?.includes("MiniBrowser")) {
      // Extract process id
      const match = stdout.match(/\b\d+\b/);
      if (match) {
        // This kills any process, not just child processes.
        killChildProcesses(match);
      }
    }
    callback();
  });
};

module.exports = {
  "launcher:Epiphany": ["type", EpiphanyBrowser],
  "launcher:Safari": ["type", SafariBrowser],
  "launcher:Webkit": ["type", WebkitBrowser],
  "launcher:WebkitHeadless": ["type", WebkitHeadlessBrowser],
};
const svgtofont = require('svgtofont');
const path = require('path');
const process = require('process');
// uncaughtException will already kill the process but unhandledRejection does not yet: https://github.com/nodejs/node/issues/20392
process.on('unhandledRejection', error => {
    global.console.log(`[runner unhandled promise rejection]: ${error}`);
    process.exit(1);
});

(async () => {
    await svgtofont({
        src: path.resolve(__dirname, '../../assets-icons'),
        dist: path.resolve(__dirname, '../../dist-icons'),
        styleTemplates: path.resolve(__dirname, 'templates'),
        fontName: 'nimble-icons',
        emptyDist: true,
        css: true,
        outSVGReact: false
    });
})();

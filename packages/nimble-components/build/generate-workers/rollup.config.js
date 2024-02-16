const path = require('path');

export default {
    input: path.resolve(__dirname, 'dist/esm/render-worker.js'),
    output: {
        file: path.resolve(__dirname, 'dist/esm/render-worker.js'),
        format: 'iife',
        name: 'RenderWorker',
        sourcemap: false
    }
};

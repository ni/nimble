import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';

const path = require('path');

export default {
    input: path.resolve(__dirname, 'source/index.js'),
    output: {
        file: path.resolve(__dirname, '../../dist/reboot.js'),
        format: 'esm'
    },
    plugins: [
        scss(),
        copy({
            targets: [
                { src: path.resolve(__dirname, '../../src/reboot/reboot.scss'), dest: path.resolve(__dirname, '../../dist/') }
            ]
        })
    ]
};
#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { convertXliff2Json } from './convert';

// This is how yargs expects to be run at the entry point of a cli application
// eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-floating-promises
yargs(hideBin(process.argv))
    .strict()
    .scriptName('xliff-to-angular-json')
    .usage('$0 --src <src.xlf> --dst <dst.json>')
    .command(
        '$0',
        'Convert source xliff file to angular simple json format',
        yargsObj => yargsObj
            .option('src', {
                type: 'string',
                describe: 'Source xliff file',
                demandOption: true
            })
            .option('dst', {
                type: 'string',
                describe: 'Destination json file',
                demandOption: true
            }),
        async argv => {
            const { src, dst } = argv;
            console.log(`Converting ${src} -> ${dst}`);
            await convertXliff2Json(src, dst);
        }
    )
    .help()
    .argv;

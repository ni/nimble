#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { convertXliff2Json } from './convert';

// This is how yargs expects to be run at the entry point of a cli application
// eslint-disable-next-line @typescript-eslint/no-unused-expressions, @typescript-eslint/no-floating-promises
yargs(hideBin(process.argv))
    .strict()
    .scriptName('xliff-to-json-converter')
    .usage('$0 --source <src.xlf> --destination <dst.json>')
    .command(
        '$0',
        'Convert source xliff file to angular simple json format',
        yargsObj => yargsObj
            .option('source', {
                alias: 's',
                type: 'string',
                describe: 'Source xliff file',
                demandOption: true
            })
            .option('destination', {
                alias: 'd',
                type: 'string',
                describe: 'Destination json file',
                demandOption: true
            }),
        async argv => {
            const { source, destination } = argv;
            console.log(`Converting ${source} -> ${destination}`);
            await convertXliff2Json(source, destination);
        }
    )
    .help()
    .argv;

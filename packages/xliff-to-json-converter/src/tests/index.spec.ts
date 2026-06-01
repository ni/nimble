import { execFile as execFileCallback } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

describe('xliff-to-json-converter cli', () => {
    let tempDir: string;
    let sourceFile: string;
    let destinationFile: string;

    beforeEach(async () => {
        tempDir = await mkdtemp(join(tmpdir(), 'xliff-to-json-converter-'));
        sourceFile = join(tempDir, 'messages.de.xlf');
        destinationFile = join(tempDir, 'messages.de.json');
    });

    afterEach(async () => {
        await rm(tempDir, { recursive: true, force: true });
    });

    it('converts an xliff file passed on the command line', async () => {
        const cliPath = fileURLToPath(new URL('../index.js', import.meta.url));
        const xliffContents = `
          <?xml version="1.0" encoding="UTF-8"?>
          <xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
            <file source-language="en-US" datatype="plaintext" original="ng2.template" target-language="de-DE">
              <body>
                <trans-unit id="2821179408673282599" datatype="html">
                  <source>Home</source><target state="final">Startseite</target>
                </trans-unit>
              </body>
            </file>
          </xliff>
        `;

        await writeFile(sourceFile, xliffContents);

        const { stdout } = await execFile(process.execPath, [
            cliPath,
            '--source',
            sourceFile,
            '--destination',
            destinationFile
        ]);

        const jsonContents = await readFile(destinationFile, 'utf-8');

        expect(stdout).toContain(`Converting ${sourceFile} -> ${destinationFile}`);
        expect(JSON.parse(jsonContents)).toEqual({
            locale: 'de-DE',
            translations: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                '2821179408673282599': 'Startseite'
            }
        });
    });
});
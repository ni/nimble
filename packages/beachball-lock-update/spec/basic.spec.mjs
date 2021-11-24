import tempy from 'tempy';
import fs from 'fs';
import { createPostbump } from '../src/index.js';

describe('hello world', () => {
    it('hi', async () => {
        const lockFile = tempy.writeSync('{}');
        const postbump = createPostbump(lockFile);
        postbump('', '', '');
        const result = fs.readFileSync(lockFile, { encoding: 'utf-8' });
        expect(result).toBe('hello');
    });
});

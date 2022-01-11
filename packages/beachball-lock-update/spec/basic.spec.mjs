import tempy from 'tempy';
import fs from 'fs';
import { createPostbump } from '../src/index.js';

describe('beachball lock update', () => {
    it('processes package references', async () => {
        const lockFile = tempy.writeSync(JSON.stringify({
            packages: {
                'a-package': {
                    dependencies: {
                        'my-package': '^1.0.0'
                    }
                }
            }
        }));
        const postbump = createPostbump(lockFile);
        const packageName = 'my-package';
        const packageVersion = '2.0.0';
        postbump('', packageName, packageVersion);
        const result = fs.readFileSync(lockFile, { encoding: 'utf-8' });
        const resultNormalized = JSON.parse(result);
        expect(resultNormalized).toEqual({
            packages: {
                'a-package': {
                    dependencies: {
                        'my-package': '^2.0.0'
                    }
                }
            }
        });
    });
    it('processes package definitions', async () => {
        const lockFile = tempy.writeSync(JSON.stringify({
            packages: {
                'package-folder/my-package': {
                    name: 'my-package',
                    version: '1.0.0'
                }
            }
        }));
        const postbump = createPostbump(lockFile);
        const packageName = 'my-package';
        const packageVersion = '2.0.0';
        postbump('', packageName, packageVersion);
        const result = fs.readFileSync(lockFile, { encoding: 'utf-8' });
        const resultNormalized = JSON.parse(result);
        expect(resultNormalized).toEqual({
            packages: {
                'package-folder/my-package': {
                    name: 'my-package',
                    version: '2.0.0'
                }
            }
        });
    });
});

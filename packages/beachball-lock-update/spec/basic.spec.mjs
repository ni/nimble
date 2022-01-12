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
        const result = JSON.parse(fs.readFileSync(lockFile, { encoding: 'utf-8' }));
        expect(result).toEqual({
            packages: {
                'a-package': {
                    dependencies: {
                        'my-package': '^2.0.0'
                    }
                }
            }
        });
    });
    it('skip processing package references with version "*"', async () => {
        const lockFile = tempy.writeSync(JSON.stringify({
            packages: {
                'a-package': {
                    dependencies: {
                        'my-package': '*'
                    }
                }
            }
        }));
        const postbump = createPostbump(lockFile);
        const packageName = 'my-package';
        const packageVersion = '2.0.0';
        postbump('', packageName, packageVersion);
        const result = JSON.parse(fs.readFileSync(lockFile, { encoding: 'utf-8' }));
        expect(result).toEqual({
            packages: {
                'a-package': {
                    dependencies: {
                        'my-package': '*'
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
        const result = JSON.parse(fs.readFileSync(lockFile, { encoding: 'utf-8' }));
        expect(result).toEqual({
            packages: {
                'package-folder/my-package': {
                    name: 'my-package',
                    version: '2.0.0'
                }
            }
        });
    });
});

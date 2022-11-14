import { stringify, JsonFile } from './json-file';

describe('JsonFile', () => {
    it('can convert to string', async () => {
        const jsonFile = {
            locale: 'de',
            translations: {
                /* eslint-disable @typescript-eslint/naming-convention */
                123: 'foo',
                321: 'bar',
                211: 'baz'
                /* eslint-enable @typescript-eslint/naming-convention */
            }
        } as JsonFile;

        const json = stringify(jsonFile);

        expect(json).toContain('locale');
        expect(json).toContain('de');
        expect(json).toContain('123');
        expect(json).toContain('foo');
        expect(json).toContain('321');
        expect(json).toContain('bar');
        expect(json).toContain('211');
        expect(json).toContain('baz');
    });
});

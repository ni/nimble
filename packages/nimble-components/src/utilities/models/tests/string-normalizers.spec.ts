import { parameterizeNamedList } from '../../../testing/parameterized';
import { diacriticInsensitiveStringNormalizer } from '../string-normalizers';

// Wacky strings copied from '../../tests/wacky-strings.ts' and updated their corresponding normalized string output
const wackyStrings = [
    { name: '<button></button>', output: '<button></button>' },
    { name: 'null', output: 'null' },
    { name: 'undefined', output: 'undefined' },
    { name: 'NaN', output: 'nan' },
    { name: '-Infinity', output: '-infinity' },
    { name: 'Infinity', output: 'infinity' },
    { name: '\x00', output: '\x00' },
    { name: '-2147483648/-1', output: '-2147483648/-1' },
    { name: '田', output: '田' },
    { name: 'Ω', output: 'ω' },
    { name: '( ͡° ͜ʖ ͡°)', output: '( ° ʖ °)' },
    { name: '😍', output: '😍' },
    {
        name: 'Français é, è, ê and ë (French characters)',
        output: 'francais e, e, e and e (french characters)'
    },
    {
        name: 'Doppelgänger ö, ü, ß (German characters)',
        output: 'doppelganger o, u, ß (german characters)'
    },
    {
        name: '日本語 (Japanese characters)',
        output: '日本語 (japanese characters)'
    },
    { name: '中文 (Chinese characters)', output: '中文 (chinese characters)' },
    { name: 'Iñtërnâtiônàlizætiøn☃💩', output: 'internationalizætiøn☃💩' },
    { name: '１', output: '１' }
] as const;

describe('The string normalizer utility', () => {
    parameterizeNamedList(wackyStrings, (spec, name, value) => {
        spec(`for ${name}`, () => {
            const normalizedString = diacriticInsensitiveStringNormalizer(
                value.name
            );

            expect(normalizedString).toBe(value.output);
        });
    });
});

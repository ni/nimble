import * as designTokensNamespace from '../design-tokens';
import { tokenNames } from '../design-token-names';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import { ThemeProvider } from '..';

type DesignTokenPropertyName = keyof typeof designTokensNamespace;
const designTokenPropertyNames = Object.keys(designTokensNamespace) as DesignTokenPropertyName[];

describe('Theme Provider', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-theme-provider')).toBeInstanceOf(ThemeProvider);
    });

    describe('design token should match CSSDesignToken', () => {
        const tokenEntries = designTokenPropertyNames.map((name: DesignTokenPropertyName) => ({
            name,
            cssDesignToken: designTokensNamespace[name]
        }));
        const tokenNameValues = Object.values(tokenNames);

        for (const tokenEntry of tokenEntries) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(tokenEntry, focused, disabled);
            specType(
                `for token name ${tokenEntry.name}`,
                () => {
                    const tokenValue = tokenEntry.cssDesignToken.name.split('ni-nimble-')[1]!;
                    expect(tokenNameValues).toContain(tokenValue);
                }
            );
        }
    });

    describe('design token should match JS key', () => {
        const propertyNames = designTokenPropertyNames.map((name: DesignTokenPropertyName) => ({ name }));
        const tokenNameValues = Object.values(tokenNames);

        for (const propertyName of propertyNames) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(propertyName, focused, disabled);
            specType(`for token name ${propertyName.name}`, () => {
                const convertedTokenValue = camelToKebabCase(propertyName.name);
                expect(tokenNameValues).toContain(convertedTokenValue);
            });
        }

        function camelToKebabCase(text: string): string {
            // Adapted from https://stackoverflow.com/a/67243723
            return text.replace(
                /[A-Z]+(?![a-z])|[A-Z]|[0-9]/g,
                (substring, offset) => (offset !== 0 ? '-' : '') + substring.toLowerCase()
            );
        }
    });

    describe('design token has approved suffix', () => {
        // Order of suffixes in the array matter, as we want single word suffixes after the multi-word ones
        const tokenSuffixes = [
            'RgbPartialColor',
            'FontColor',
            'FontLineHeight',
            'FontWeight',
            'FontSize',
            'TextTransform',
            'FontFamily',
            'Font',
            'Size',
            'Width',
            'Height',
            'Delay',
            'Padding',
            'Color'
        ];
        const propertyNames = designTokenPropertyNames.map((name: DesignTokenPropertyName) => ({ name }));
        for (const propertyName of propertyNames) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(propertyName, focused, disabled);
            specType(`for token name ${propertyName.name}`, () => {
                expect(tokenSuffixes.some(tokenSuffix => propertyName.name.endsWith(tokenSuffix))).toBeTrue();
            });
        }
    });
});

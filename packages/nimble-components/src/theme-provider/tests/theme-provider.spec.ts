import '..';
import * as tokens from '../design-tokens';
import { tokenNames } from '../design-token-names';
import { getSpecType } from '../../utilities/tests/parameterized';

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

describe('Design Tokens', () => {
    const tokenEntries = Object.entries(tokens).map(([key, valueObj]) => ({
        name: key,
        value: valueObj.name
    }));
    const tokenNameValues = Object.values(tokenNames);

    for (const tokenEntry of tokenEntries) {
        const isFocused = (): boolean => false;
        const isDisabled = (): boolean => false;
        const specType = getSpecType(tokenEntry, isFocused, isDisabled);
        specType(
            `value of exported token name ${tokenEntry.name} should match name of CSSDesignToken`,
            () => {
                const tokenValue = tokenEntry.value.split('ni-nimble-')[1]!;
                expect(tokenNameValues).toContain(tokenValue);
            }
        );
    }

    const tokenNameKeys = Object.keys(tokenNames);
    for (const tokenNameKey of tokenNameKeys) {
        const isFocused = (): boolean => false;
        const isDisabled = (): boolean => false;
        const specType = getSpecType(tokenNameKey, isFocused, isDisabled);
        specType(`Design token name ${tokenNameKey} matches the JS key`, () => {
            const convertedTokenValue = camelToKebabCase(tokenNameKey);
            expect(tokenNameValues).toContain(convertedTokenValue);
        });
    }

    const tokenKeys = Object.keys(tokens);
    for (const tokenKey of tokenKeys) {
        const isFocused = (): boolean => false;
        const isDisabled = (): boolean => false;
        const specType = getSpecType(tokenKey, isFocused, isDisabled);
        specType(`Token ${tokenKey} has approved suffix`, () => {
            let tokenKeyPassed = false;
            for (const tokenSuffx of tokenSuffixes) {
                tokenKeyPassed = tokenKey.endsWith(tokenSuffx);
                if (tokenKeyPassed) {
                    break;
                }
            }

            expect(tokenKeyPassed).toBeTrue();
        });
    }
});

function camelToKebabCase(text: string): string {
    // Adapted from https://stackoverflow.com/a/67243723
    return text.replace(
        /[A-Z]+(?![a-z])|[A-Z]|[0-9]/g,
        (substring, offset) => (offset !== 0 ? '-' : '') + substring.toLowerCase()
    );
}

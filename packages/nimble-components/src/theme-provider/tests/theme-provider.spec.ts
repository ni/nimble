import { spinalCase } from '@microsoft/fast-web-utilities';
import * as designTokensNamespace from '../design-tokens';
import { tokenNames, tokenSuffixes } from '../design-token-names';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import { ThemeProvider } from '..';

type DesignTokenPropertyName = keyof typeof designTokensNamespace;
const designTokenPropertyNames = Object.keys(
    designTokensNamespace
) as DesignTokenPropertyName[];

describe('Theme Provider', () => {
    it('can construct an element instance', () => {
        expect(document.createElement('nimble-theme-provider')).toBeInstanceOf(
            ThemeProvider
        );
    });

    describe('design token should match CSSDesignToken', () => {
        const tokenEntries = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({
                name,
                cssDesignToken: designTokensNamespace[name]
            })
        );
        const tokenNameValues = Object.values(tokenNames);

        for (const tokenEntry of tokenEntries) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                tokenEntry,
                focused,
                disabled
            );
            specType(`for token name ${tokenEntry.name}`, () => {
                const tokenValue = tokenEntry.cssDesignToken.name.split('ni-nimble-')[1]!;
                expect(tokenNameValues).toContain(tokenValue);
            });
        }
    });

    describe('design token should match JS key', () => {
        const propertyNames = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({ name })
        );
        const tokenNameValues = Object.values(tokenNames);

        for (const propertyName of propertyNames) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                propertyName,
                focused,
                disabled
            );
            specType(`for token name ${propertyName.name}`, () => {
                const convertedTokenValue = spinalCase(propertyName.name);
                expect(tokenNameValues).toContain(convertedTokenValue);
            });
        }
    });

    describe('design token has approved suffix', () => {
        const propertyNames = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({ name })
        );
        for (const propertyName of propertyNames) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                propertyName,
                focused,
                disabled
            );
            specType(`for token name ${propertyName.name}`, () => {
                expect(
                    tokenSuffixes.some(tokenSuffix => propertyName.name.endsWith(tokenSuffix))
                ).toBeTrue();
            });
        }
    });
});

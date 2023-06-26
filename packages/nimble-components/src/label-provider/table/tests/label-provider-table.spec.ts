import { spinalCase } from '@microsoft/fast-web-utilities';
import { html } from '@microsoft/fast-element';
import * as labelTokensNamespace from '../label-tokens';
import { LabelProviderTable, labelProviderTableTag } from '..';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { getAttributeName, getPropertyName } from '../../base/label-name-utils';
import { ThemeProvider, themeProviderTag } from '../../../theme-provider';
import { Fixture, fixture } from '../../../utilities/tests/fixture';
import { removeTablePrefixAndCamelCase } from '../name-utils';

type DesignTokenPropertyName = keyof typeof labelTokensNamespace;
const designTokenPropertyNames = Object.keys(
    labelTokensNamespace
) as DesignTokenPropertyName[];

async function setup(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(html`
        <${themeProviderTag}>
            <${labelProviderTableTag}></${labelProviderTableTag}>
        </${themeProviderTag}>
    `);
}

describe('Label Provider Table', () => {
    let element: LabelProviderTable;
    let themeProvider: ThemeProvider;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element: themeProvider, connect, disconnect } = await setup());
        element = themeProvider.querySelector(labelProviderTableTag)!;
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-label-provider-table')
        ).toBeInstanceOf(LabelProviderTable);
    });

    describe('token JS key should match DesignToken.name', () => {
        const tokenEntries = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({
                name,
                labelToken: labelTokensNamespace[name]
            })
        );

        for (const tokenEntry of tokenEntries) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                tokenEntry,
                focused,
                disabled
            );
            specType(`for token name ${tokenEntry.name}`, () => {
                const convertedTokenValue = spinalCase(tokenEntry.name);
                expect(tokenEntry.labelToken.name).toBe(convertedTokenValue);
            });
        }
    });

    describe('token JS key should match a LabelProvider property/attribute', () => {
        const tokenEntries = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({
                name,
                labelToken: labelTokensNamespace[name]
            })
        );

        for (const tokenEntry of tokenEntries) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                tokenEntry,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for token name ${tokenEntry.name}`, () => {
                const tokenName = removeTablePrefixAndCamelCase(
                    tokenEntry.name
                );
                const expectedPropertyName = getPropertyName(tokenName);
                const expectedAttributeName = getAttributeName(tokenName);
                const attributeDefinition = element.$fastController.definition.attributes.find(
                    a => a.name === expectedPropertyName
                );
                expect(attributeDefinition).toBeDefined();
                expect(expectedAttributeName).toEqual(
                    attributeDefinition!.attribute
                );
            });
        }
    });

    describe('token value is updated after setting corresponding LabelProvider attribute', () => {
        const tokenEntries = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({
                name,
                labelToken: labelTokensNamespace[name]
            })
        );

        for (const tokenEntry of tokenEntries) {
            const focused: DesignTokenPropertyName[] = [];
            const disabled: DesignTokenPropertyName[] = [];
            const specType = getSpecTypeByNamedList(
                tokenEntry,
                focused,
                disabled
            );
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(`for token name ${tokenEntry.name}`, () => {
                const tokenName = removeTablePrefixAndCamelCase(
                    tokenEntry.name
                );
                const attributeName = getAttributeName(tokenName);
                const updatedValue = `NewString-${tokenName}`;
                element.setAttribute(attributeName, updatedValue);

                expect(tokenEntry.labelToken.getValueFor(themeProvider)).toBe(
                    updatedValue
                );
            });
        }
    });
});

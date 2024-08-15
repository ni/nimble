import { html } from '@microsoft/fast-element';
import { spinalCase } from '@microsoft/fast-web-utilities';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import * as designTokensNamespace from '../design-tokens';
import { tokenNames, suffixFromTokenName } from '../design-token-names';
import { ThemeProvider, lang, themeProviderTag } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

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

    describe('lang token', () => {
        async function setup(
            langValue: string | undefined
        ): Promise<Fixture<ThemeProvider>> {
            return fixture<ThemeProvider>(
                html`<${themeProviderTag} ${
                    langValue === undefined ? '' : `lang="${langValue}"`
                }>
                    </${themeProviderTag}>`
            );
        }

        let element: ThemeProvider;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;
        let pageLangToRestore: string | null;

        beforeEach(() => {
            pageLangToRestore = document.documentElement.getAttribute('lang');
        });

        afterEach(async () => {
            await disconnect();
            if (pageLangToRestore === null) {
                document.documentElement.removeAttribute('lang');
            } else {
                document.documentElement.setAttribute(
                    'lang',
                    pageLangToRestore
                );
            }
        });

        it('value is set to "fr-FR" when theme provider lang attribute is assigned value "fr-FR"', async () => {
            ({ element, connect, disconnect } = await setup('fr-FR'));
            await connect();
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('fr-FR');
        });

        it('value defaults to page lang when theme provider lang attribute is removed', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup('fr-FR'));
            await connect();
            element.removeAttribute('lang');
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('de-DE');
        });

        it('value defaults to page lang when theme provider lang attribute is undefined', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup(undefined));
            await connect();
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('de-DE');
            expect(element.validity.invalidLang).toBeFalse();
        });

        it('value defaults to page lang when theme provider lang attribute is empty string', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup(''));
            await connect();
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('de-DE');
            expect(element.validity.invalidLang).toBeTrue();
        });

        it('value defaults to page lang when theme provider lang attribute is malformed', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup('123'));
            await connect();
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('de-DE');
            expect(element.validity.invalidLang).toBeTrue();
        });

        it('value updates when page lang changes (while theme provider lang unset)', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup(undefined));
            await connect();
            await waitForUpdatesAsync();
            document.documentElement.lang = 'fr-FR';
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('fr-FR');
            expect(element.validity.invalidLang).toBeFalse();
        });

        it('value updates when theme provider lang attribute goes from invalid to valid', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup('123'));
            await connect();
            await waitForUpdatesAsync();
            element.setAttribute('lang', 'fr-CA');
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('fr-CA');
            expect(element.validity.invalidLang).toBeFalse();
        });

        it('value updates when theme provider lang attribute goes from valid to invalid', async () => {
            document.documentElement.lang = 'de-DE';
            ({ element, connect, disconnect } = await setup('fr-FR'));
            await connect();
            await waitForUpdatesAsync();
            element.setAttribute('lang', '123');
            await waitForUpdatesAsync();
            expect(lang.getValueFor(element)).toBe('de-DE');
            expect(element.validity.invalidLang).toBeTrue();
        });

        it('value defaults to system default (en-US) when page lang is malformed and theme provider lang is malformed', async () => {
            document.documentElement.lang = '123';
            ({ element, connect, disconnect } = await setup('456'));
            await connect();
            await waitForUpdatesAsync();
            // our karma config and GitHub actions config set the lang to en-US
            expect(lang.getValueFor(element)).toBe('en-US');
        });
    });

    describe('design token should match CSSDesignToken', () => {
        const tokenEntries = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({
                name,
                cssDesignToken: designTokensNamespace[name]
            })
        );
        const tokenNameValues = Object.values(tokenNames);

        parameterizeSpec(tokenEntries, (spec, name, value) => {
            spec(`for token name ${name}`, () => {
                const tokenValue = value.cssDesignToken.name.split('ni-nimble-')[1]!;
                expect(tokenNameValues).toContain(tokenValue);
            });
        });
    });

    describe('design token should match JS key', () => {
        const propertyNames = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({ name })
        );
        const tokenNameValues = Object.values(tokenNames);

        parameterizeSpec(propertyNames, (spec, name) => {
            spec(`for token name ${name}`, () => {
                const convertedTokenValue = spinalCase(name);
                expect(tokenNameValues).toContain(convertedTokenValue);
            });
        });
    });

    describe('design token has approved suffix', () => {
        const propertyNames = designTokenPropertyNames.map(
            (name: DesignTokenPropertyName) => ({ name })
        );
        parameterizeSpec(propertyNames, (spec, name) => {
            spec(`for token name ${name}`, () => {
                expect(suffixFromTokenName(name)).not.toBeUndefined();
            });
        });
    });
});

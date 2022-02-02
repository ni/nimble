/* eslint-disable max-classes-per-file */

import {
    FASTElement,
    html,
    DOM,
    observable,
    css,
    ref,
    ElementStyles
} from '@microsoft/fast-element';
import { ThemeProvider } from '../../../theme-provider';
import { Theme } from '../../../theme-provider/types';
import type { LightStyle, DarkStyleOrAlias, ColorStyleOrAlias, LegacyBlueStyleOrAlias } from '../theme';
import { uniqueElementName, fixture } from '../../tests/fixture';
import type { Fixture } from '../../tests/fixture';
import { themeBehavior } from '../theme';

/**
 * Test element with theme-aware styles
 */
class ThemedElement extends FASTElement {
    public themeTarget!: HTMLDivElement;

    public static createThemeStyle(name: string): ElementStyles {
        return css`
            div {
                --private-prop: '${CSS.escape(name)}';
            }
        `;
    }

    public getThemedStyle(): string {
        // Computed custom property values are double quoted strings very similar to JSON strings.
        // Think it's safe to JSON.parse, but if the pattern is used elsewhere then validate the
        // CSS "serialize a string" alogorithm is compatible with JSON.parse:
        // https://drafts.csswg.org/cssom/#serialize-a-string
        return JSON.parse(
            window
                .getComputedStyle(this.themeTarget)
                .getPropertyValue('--private-prop')
        ) as string;
    }
}

/**
 * Test helper to configure theme
 */
class ThemeSetter {
    @observable
    public theme = Theme.Light;

    public themedElement!: ThemedElement;
}

interface ThemeStyles {
    [Theme.Light]: LightStyle;
    [Theme.Dark]: DarkStyleOrAlias;
    [Theme.Color]: ColorStyleOrAlias;
    [Theme.LegacyBlue]: LegacyBlueStyleOrAlias;
}

const setup = async (themeSetter: ThemeSetter, themeStyles: ThemeStyles): Promise<Fixture<ThemeProvider>> => {
    const name = uniqueElementName();
    const template = html<ThemedElement>`<div ${ref('themeTarget')}></div>`;
    const styles = ThemedElement.createThemeStyle('style-unset')
        .withBehaviors(
            themeBehavior(
                themeStyles[Theme.Light],
                themeStyles[Theme.Dark],
                themeStyles[Theme.Color],
                themeStyles[Theme.LegacyBlue]
            )
        );

    /** @inheritdoc */
    class ThemedElementVariation extends ThemedElement {
        public static definition = {
            name,
            template,
            styles
        };
    }
    FASTElement.define(ThemedElementVariation);

    return fixture<ThemeProvider>(
        html<ThemeSetter>`
        <nimble-theme-provider theme=${x => x.theme}>
            <${name} ${ref('themedElement')}></${name}>
        </nimble-theme-provider>
    `,
        { source: themeSetter }
    );
};

describe('The fixture helper', () => {
    it('can create a fixture for an element by template', async () => {
        const themeSetter = new ThemeSetter();
        const { element, connect } = await setup(themeSetter, {
            [Theme.Light]: ThemedElement.createThemeStyle('style-light'),
            [Theme.Dark]: ThemedElement.createThemeStyle('style-dark'),
            [Theme.Color]: ThemedElement.createThemeStyle('style-color'),
            [Theme.LegacyBlue]: ThemedElement.createThemeStyle('style-legacy-blue'),
        });
        expect(element).toBeInstanceOf(ThemeProvider);
        expect(themeSetter.themedElement).toBeInstanceOf(ThemedElement);
        await connect();
        expect(themeSetter.themedElement.getThemedStyle()).toBe('style-light');
        themeSetter.theme = Theme.Dark;
        await DOM.nextUpdate();
        expect(themeSetter.themedElement.getThemedStyle()).toBe('style-dark');
    });
});

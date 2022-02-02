/* eslint-disable max-classes-per-file */

import {
    FASTElement,
    html,
    DOM,
    observable,
    css,
    ref,
    ElementStyles,
    ViewTemplate
} from '@microsoft/fast-element';
import { ThemeProvider } from '../../../theme-provider';
import { Theme } from '../../../theme-provider/types';
import type { LightStyle, DarkStyleOrAlias, ColorStyleOrAlias, LegacyBlueStyleOrAlias } from '../theme';
import { uniqueElementName, fixture } from '../../tests/fixture';
import type { Fixture } from '../../tests/fixture';
import { themeBehavior } from '../theme';

interface ThemeStyles {
    readonly [Theme.Light]: LightStyle;
    readonly [Theme.Dark]: DarkStyleOrAlias;
    readonly [Theme.Color]: ColorStyleOrAlias;
    readonly [Theme.LegacyBlue]: LegacyBlueStyleOrAlias;
}

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

    public static createStyle(themeStyles: ThemeStyles): ElementStyles {
        return ThemedElement.createThemeStyle('style-unset')
            .withBehaviors(
                themeBehavior(
                    themeStyles[Theme.Light],
                    themeStyles[Theme.Dark],
                    themeStyles[Theme.Color],
                    themeStyles[Theme.LegacyBlue]
                )
            );
    }

    public static createTemplate(): ViewTemplate {
        return html<ThemedElement>`<div ${ref('themeTarget')}></div>`;
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
class ThemeController {
    @observable
    public theme = Theme.Light;

    public themedElement!: ThemedElement;
}

const setup = async (themeController: ThemeController, themeStyles: ThemeStyles): Promise<Fixture<ThemeProvider>> => {
    const name = uniqueElementName();
    const template = ThemedElement.createTemplate();
    const styles = ThemedElement.createStyle(themeStyles);

    /** @inheritdoc */
    class ThemedElementVariation extends ThemedElement {
        public static definition = {
            name,
            template,
            styles
        };
    }
    FASTElement.define(ThemedElementVariation);

    const fixtureTemplate = html<ThemeController>`
        <nimble-theme-provider theme=${x => x.theme}>
            <${name} ${ref('themedElement')}></${name}>
        </nimble-theme-provider>
    `;

    return fixture<ThemeProvider>(
        fixtureTemplate,
        { source: themeController }
    );
};

describe('The fixture helper', () => {
    it('can create a fixture for an element by template', async () => {
        const themeController = new ThemeController();
        const { element, connect } = await setup(themeController, {
            [Theme.Light]: ThemedElement.createThemeStyle('style-light'),
            [Theme.Dark]: ThemedElement.createThemeStyle('style-dark'),
            [Theme.Color]: ThemedElement.createThemeStyle('style-color'),
            [Theme.LegacyBlue]: ThemedElement.createThemeStyle('style-legacy-blue'),
        });
        expect(element).toBeInstanceOf(ThemeProvider);
        expect(themeController.themedElement).toBeInstanceOf(ThemedElement);
        await connect();
        expect(themeController.themedElement.getThemedStyle()).toBe('style-light');
        themeController.theme = Theme.Dark;
        await DOM.nextUpdate();
        expect(themeController.themedElement.getThemedStyle()).toBe('style-dark');
    });
});

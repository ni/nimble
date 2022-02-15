/* eslint-disable max-classes-per-file */

import {
    FASTElement,
    html,
    observable,
    css,
    ref,
    ElementStyles,
    ViewTemplate,
    DOM
} from '@microsoft/fast-element';
import type { ThemeProvider } from '../../../theme-provider';
import { Theme } from '../../../theme-provider/types';
import type { LightStyle, DarkStyleOrAlias, ColorStyleOrAlias } from '../theme';
import { uniqueElementName, fixture } from '../../tests/fixture';
import type { Fixture } from '../../tests/fixture';
import { themeBehavior } from '../theme';
import { getSpecTypeByNamedList } from '../../tests/parameterized';

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

    public static createStyle(
        lightStyle: LightStyle,
        darkStyleOrAlias: DarkStyleOrAlias,
        colorStyleOrAlias: ColorStyleOrAlias
    ): ElementStyles {
        return ThemedElement.createThemeStyle('style-unset').withBehaviors(
            themeBehavior(lightStyle, darkStyleOrAlias, colorStyleOrAlias)
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

const setup = async (
    themeController: ThemeController,
    styles: ElementStyles
): Promise<Fixture<ThemeProvider>> => {
    const name = uniqueElementName();
    const template = ThemedElement.createTemplate();

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

    return fixture<ThemeProvider>(fixtureTemplate, { source: themeController });
};

const themedElementTest = (
    configs: { name: Theme, resolvedProperty: string }[],
    focused: Theme[],
    disabled: Theme[],
    styles: ElementStyles
): void => {
    for (const config of configs) {
        const specType = getSpecTypeByNamedList(config, focused, disabled);
        specType(`Can respond to theme ${config.name}`, async () => {
            const themeController = new ThemeController();
            const { connect } = await setup(themeController, styles);
            await connect();
            themeController.theme = config.name;
            await DOM.nextUpdate();
            expect(themeController.themedElement.getThemedStyle()).toBe(
                config.resolvedProperty
            );
        });
    }
};

describe('The ThemeStylesheetBehavior', () => {
    describe('for unaliased options', () => {
        const configs = [
            {
                name: Theme.Light,
                resolvedProperty: 'style-light'
            },
            {
                name: Theme.Dark,
                resolvedProperty: 'style-dark'
            },
            {
                name: Theme.Color,
                resolvedProperty: 'style-color'
            }
        ];
        const focused: Theme[] = [];
        const disabled: Theme[] = [];
        const styles = ThemedElement.createStyle(
            ThemedElement.createThemeStyle('style-light'),
            ThemedElement.createThemeStyle('style-dark'),
            ThemedElement.createThemeStyle('style-color')
        );
        themedElementTest(configs, focused, disabled, styles);
    });

    describe('for null options', () => {
        const configs = [
            {
                name: Theme.Light,
                resolvedProperty: 'style-unset'
            },
            {
                name: Theme.Dark,
                resolvedProperty: 'style-unset'
            },
            {
                name: Theme.Color,
                resolvedProperty: 'style-unset'
            }
        ];
        const focused: Theme[] = [];
        const disabled: Theme[] = [];
        const styles = ThemedElement.createStyle(null, null, null);
        themedElementTest(configs, focused, disabled, styles);
    });

    describe('for an aliased dark option', () => {
        const configs = [
            {
                name: Theme.Light,
                resolvedProperty: 'style-light'
            },
            {
                name: Theme.Dark,
                resolvedProperty: 'style-light'
            },
            {
                name: Theme.Color,
                resolvedProperty: 'style-color'
            }
        ];
        const focused: Theme[] = [];
        const disabled: Theme[] = [];
        const styles = ThemedElement.createStyle(
            ThemedElement.createThemeStyle('style-light'),
            Theme.Light,
            ThemedElement.createThemeStyle('style-color')
        );
        themedElementTest(configs, focused, disabled, styles);
    });

    describe('for an aliased color option', () => {
        const configs = [
            {
                name: Theme.Light,
                resolvedProperty: 'style-light'
            },
            {
                name: Theme.Dark,
                resolvedProperty: 'style-dark'
            },
            {
                name: Theme.Color,
                resolvedProperty: 'style-light'
            }
        ];
        const focused: Theme[] = [];
        const disabled: Theme[] = [];
        const styles = ThemedElement.createStyle(
            ThemedElement.createThemeStyle('style-light'),
            ThemedElement.createThemeStyle('style-dark'),
            Theme.Light
        );
        themedElementTest(configs, focused, disabled, styles);
    });
});

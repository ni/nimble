import {
    FASTElement,
    html,
    observable,
    css,
    ref,
    ElementStyles
} from '@ni/fast-element';
import { themeProviderTag, type ThemeProvider } from '../../../theme-provider';
import { Theme } from '../../../theme-provider/types';
import { uniqueElementName, fixture } from '../../tests/fixture';
import type { Fixture } from '../../tests/fixture';
import { themeBehavior } from '../theme';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

/**
 * Test element with theme-aware styles
 */
class ThemedElement extends FASTElement {
    public static template = html<ThemedElement>`
        <div ${ref('themeTarget')}></div>
    `;

    public static allBehaviorsStyles = css`
        div {
            --private-prop: theme-unset;
        }
    `.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                div {
                    --private-prop: theme-light;
                }
            `
            ),
            themeBehavior(
                Theme.dark,
                css`
                div {
                    --private-prop: theme-dark;
                }
            `
            ),
            themeBehavior(
                Theme.color,
                css`
                div {
                    --private-prop: theme-color;
                }
            `
            )
        );

    public static sharedDarkColorBehaviorsStyles = css`
        div {
            --private-prop: theme-unset;
        }
    `.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                div {
                    --private-prop: theme-light;
                }
            `
            ),
            themeBehavior(
                [Theme.dark, Theme.color],
                css`
                div {
                    --private-prop: theme-dark;
                }
            `
            )
        );

    public static unsetDarkColorBehaviorsStyles = css`
        div {
            --private-prop: theme-unset;
        }
    `.withBehaviors(
            themeBehavior(
                Theme.light,
                css`
                div {
                    --private-prop: theme-light;
                }
            `
            )
        );

    public themeTarget!: HTMLDivElement;

    public resolveThemedStyle(): Theme | 'theme-unset' {
        const result = window
            .getComputedStyle(this.themeTarget)
            .getPropertyValue('--private-prop');

        if (result.includes('theme-unset')) {
            return 'theme-unset';
        }
        if (result.includes('theme-light')) {
            return Theme.light;
        }
        if (result.includes('theme-dark')) {
            return Theme.dark;
        }
        if (result.includes('theme-color')) {
            return Theme.color;
        }
        throw new Error(`Unexpected property value: ${result}`);
    }
}

describe('The ThemeStylesheetBehavior', () => {
    describe('for a single themed element', () => {
        /**
         * Test helper to configure theme
         */
        class ThemeController {
            @observable
            public theme: Theme = Theme.light;

            public themedElement!: ThemedElement;
        }

        const setup = async (
            themeController: ThemeController,
            styles: ElementStyles
        ): Promise<Fixture<ThemeProvider>> => {
            const name = uniqueElementName();
            const template = ThemedElement.template;

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
                <${themeProviderTag} theme=${x => x.theme}>
                    <${name} ${ref('themedElement')}></${name}>
                </${themeProviderTag}>
            `;

            return await fixture<ThemeProvider>(fixtureTemplate, {
                source: themeController
            });
        };

        it('responds to light theme', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.light;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.light
            );
            await disconnect();
        });

        it('responds to dark theme', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.dark;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.dark
            );
            await disconnect();
        });

        it('responds to color theme', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.color;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.color
            );
            await disconnect();
        });

        it('responds to change from light theme to dark theme', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.light;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.light
            );
            themeController.theme = Theme.dark;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.dark
            );
            await disconnect();
        });

        it('can share styles for dark and color themes', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.sharedDarkColorBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.dark;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.dark
            );
            themeController.theme = Theme.color;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.dark
            );
            await disconnect();
        });

        it('can have unset color and dark themes', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.unsetDarkColorBehaviorsStyles
            );
            await connect();
            themeController.theme = Theme.light;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                Theme.light
            );
            themeController.theme = Theme.dark;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                'theme-unset'
            );
            themeController.theme = Theme.color;
            await waitForUpdatesAsync();
            expect(themeController.themedElement.resolveThemedStyle()).toBe(
                'theme-unset'
            );
            await disconnect();
        });
    });

    describe('for multiple themed elements', () => {
        /**
         * Test helper to configure theme
         */
        class ThemeController {
            @observable
            public theme1: Theme = Theme.light;

            @observable
            public theme2: Theme = Theme.light;

            public themedElement1!: ThemedElement;
            public themedElement2!: ThemedElement;
        }

        const setup = async (
            themeController: ThemeController,
            styles: ElementStyles
        ): Promise<Fixture<ThemeProvider>> => {
            const name = uniqueElementName();
            const template = ThemedElement.template;

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
                <${themeProviderTag} theme=${x => x.theme1}>
                    <${name} ${ref('themedElement1')}></${name}>
                </${themeProviderTag}>
                <${themeProviderTag} theme=${x => x.theme2}>
                    <${name} ${ref('themedElement2')}></${name}>
                </${themeProviderTag}>
            `;

            return await fixture<ThemeProvider>(fixtureTemplate, {
                source: themeController
            });
        };

        it('can have one light and one dark themed element', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme1 = Theme.light;
            themeController.theme2 = Theme.dark;
            await waitForUpdatesAsync();
            expect(themeController.themedElement1.resolveThemedStyle()).toBe(
                Theme.light
            );
            expect(themeController.themedElement2.resolveThemedStyle()).toBe(
                Theme.dark
            );
            await disconnect();
        });

        it('can have one dark and one color themed element', async () => {
            const themeController = new ThemeController();
            const { connect, disconnect } = await setup(
                themeController,
                ThemedElement.allBehaviorsStyles
            );
            await connect();
            themeController.theme1 = Theme.dark;
            themeController.theme2 = Theme.color;
            await waitForUpdatesAsync();

            expect(themeController.themedElement1.resolveThemedStyle()).toBe(
                Theme.dark
            );
            expect(themeController.themedElement2.resolveThemedStyle()).toBe(
                Theme.color
            );
            await disconnect();
        });
    });
});

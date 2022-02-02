/* eslint-disable max-classes-per-file */

import {
    customElement,
    FASTElement,
    html,
    DOM,
    observable,
    css,
    ref
} from '@microsoft/fast-element';
import { ThemeProvider } from '../../../theme-provider';
import { Theme } from '../../../theme-provider/types';
import { uniqueElementName, fixture } from '../../tests/fixture';
import { themeBehavior } from '../theme';

describe('The fixture helper', () => {
    const name = uniqueElementName();
    const template = html<ThemedElement>`<div class="theme-target" ${ref('themeTarget')}></div>`;
    const styles = css`
        .theme-target {
            --private-prop: 'style-unset';
        }
    `.withBehaviors(
            themeBehavior(
                css`
                .theme-target {
                    --private-prop: 'style-light';
                }
            `,
                css`
                .theme-target {
                    --private-prop: 'style-dark';
                }
            `,
                css`
                .theme-target {
                    --private-prop: 'style-color';
                }
            `,
                css`
                .theme-target {
                    --private-prop: 'style-legacy-blue';
                }
            `
            )
        );

    /**
     * Temporary class for testing
     */
    @customElement({
        name,
        template,
        styles
    })
    class ThemedElement extends FASTElement {
        public themeTarget: HTMLDivElement | null = null;
        public getThemedStyle(): string {
            return JSON.parse(window.getComputedStyle(this.themeTarget!).getPropertyValue('--private-prop')) as string;
        }
    }

    class ThemeSetter {
        @observable
        public theme = Theme.Light;

        public themedElement: ThemedElement | null = null;
    }

    it('can create a fixture for an element by template', async () => {
        /**
         * Test helper to configure theme
         */

        const themeSetter = new ThemeSetter();
        const { element, connect } = await fixture<ThemeProvider>(html<ThemeSetter>`
            <nimble-theme-provider theme=${x => x.theme}>
                <${name} ${ref('themedElement')}></${name}>
            </nimble-theme-provider>
        `, { source: themeSetter });

        expect(element).toBeInstanceOf(ThemeProvider);
        expect(themeSetter.themedElement).toBeInstanceOf(ThemedElement);
        await connect();
        expect(themeSetter.themedElement?.getThemedStyle()).toBe('style-light');
        themeSetter.theme = Theme.Dark;
        await DOM.nextUpdate();
        expect(themeSetter.themedElement?.getThemedStyle()).toBe('style-light');
    });
});

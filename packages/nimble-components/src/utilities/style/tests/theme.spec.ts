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
    const template = html<ThemedElement>`<div ${ref('themeTarget')}></div>`;
    const styles = css`
        div {
            --private-prop: 'style-unset';
        }
    `.withBehaviors(
            themeBehavior(
                css`
                div {
                    --private-prop: 'style-light';
                }
            `,
                css`
                div {
                    --private-prop: 'style-dark';
                }
            `,
                css`
                div {
                    --private-prop: 'style-color';
                }
            `,
                css`
                div {
                    --private-prop: 'style-legacy-blue';
                }
            `
            )
        );

    /**
     * Test element with theme-aware styles
     */
    @customElement({
        name,
        template,
        styles
    })
    class ThemedElement extends FASTElement {
        public themeTarget: HTMLDivElement | null = null;
        public getThemedStyle(): string {
            // Computed custom property values are double quoted strings very similar to JSON strings
            // Think it's safe, but if the pattern is used elsewhere validate the
            // CSS serialize a string alogorithm is compatible: https://drafts.csswg.org/cssom/#serialize-a-string
            return JSON.parse(
                window
                    .getComputedStyle(this.themeTarget!)
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

        public themedElement: ThemedElement | null = null;
    }

    it('can create a fixture for an element by template', async () => {
        const themeSetter = new ThemeSetter();
        const { element, connect } = await fixture<ThemeProvider>(
            html<ThemeSetter>`
            <nimble-theme-provider theme=${x => x.theme}>
                <${name} ${ref('themedElement')}></${name}>
            </nimble-theme-provider>
        `,
            { source: themeSetter }
        );

        expect(element).toBeInstanceOf(ThemeProvider);
        expect(themeSetter.themedElement).toBeInstanceOf(ThemedElement);
        await connect();
        expect(themeSetter.themedElement?.getThemedStyle()).toBe('style-light');
        themeSetter.theme = Theme.Dark;
        await DOM.nextUpdate();
        expect(themeSetter.themedElement?.getThemedStyle()).toBe('style-dark');
    });
});

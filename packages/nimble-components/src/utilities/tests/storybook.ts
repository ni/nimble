import { html, ViewTemplate } from '@microsoft/fast-element';
import type { Story } from '@storybook/html';
import type { Theme } from '../../theme-provider/types';
import { createMatrix } from './matrix';
import {
    BackgroundState,
    backgroundStates,
    defaultBackgroundState
} from './states';

/**
 * Renders a ViewTemplate as elements in a DocumentFragment.
 * Bindings, such as event binding, will be active.
 */
const renderViewTemplate = <TSource>(
    viewTemplate: ViewTemplate<TSource>,
    source: TSource
): DocumentFragment => {
    const template = document.createElement('template');
    const fragment = template.content;
    viewTemplate.render(source, fragment);
    return fragment;
};

/**
 *  Renders a FAST `html` template as a story.
 */
export const createStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): Story<TSource> => {
    return (source: TSource, _context: unknown): Element => {
        const wrappedViewTemplate = html<TSource>`
            <div class="code-hide-top-container">${viewTemplate}</div>
        `;
        const fragment = renderViewTemplate(wrappedViewTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

const getGlobalTheme = (context: unknown): Theme => {
    type GlobalValue = string | undefined;
    // @ts-expect-error Accessing the global background defined in preview.js
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const globalValue = context?.globals?.backgrounds?.value as GlobalValue;
    const background = backgroundStates.find(({ value }) => value === globalValue)
        ?? defaultBackgroundState;
    return background.theme;
};

/**
 *  Renders a FAST `html` template as a story that responds to the background theme selection.
 */
export const createThemeAwareStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): Story<TSource> => {
    return (source: TSource, context: unknown): Element => {
        const wrappedViewTemplate = html<TSource>`
            <nimble-theme-provider
                theme="${getGlobalTheme(context)}"
                class="code-hide-top-container"
            >
                ${viewTemplate}
            </nimble-theme-provider>
        `;
        const fragment = renderViewTemplate(wrappedViewTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

/**
 * Renders a FAST `html` template with a a specific theme.
 * Useful when the template can't be tested multiple times in a single story
 * and instead the test is broken up across multiple stories.
 */
export const createFixedThemeStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>,
    backgroundState: BackgroundState
): Story<TSource> => {
    return (source: TSource, _context: unknown): Element => {
        const wrappedViewTemplate = html<TSource>`
            <nimble-theme-provider
                theme="${backgroundState.theme}"
                class="code-hide-top-container"
            >
                <div
                    style="
                        background-color: ${backgroundState.value};
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0px;
                        top: 0px;
                    "
                    class="code-hide"
                ></div>
                ${viewTemplate}
            </nimble-theme-provider>
        `;
        const fragment = renderViewTemplate(wrappedViewTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

/**
 *  Renders a FAST `html` template for each theme.
 */
export const createMatrixThemeStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): Story<TSource> => {
    return (source: TSource, _context: unknown): Element => {
        const matrixTemplate = createMatrix(
            ({ theme, value }: BackgroundState) => html`
                <nimble-theme-provider theme="${theme}">
                    <div style="background-color: ${value}; padding:20px;">
                        ${viewTemplate}
                    </div>
                </nimble-theme-provider>
            `,
            [backgroundStates]
        );
        const wrappedMatrixTemplate = html<TSource>`
            <div class="code-hide-top-container">${matrixTemplate}</div>
        `;
        const fragment = renderViewTemplate(wrappedMatrixTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

export const overrideWarning = (
    propertySummaryName: string,
    howToOverride: string
): string => `
<details>
<summary>Overriding ${propertySummaryName} Values</summary>
Overrides of properties are not recommended and are not theme-aware by default. If a needed value is not available, you should create an issue to discuss with the Nimble squad.

${howToOverride}
</details>`;

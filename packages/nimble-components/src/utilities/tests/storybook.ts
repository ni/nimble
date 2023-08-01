import { html, ViewTemplate } from '@microsoft/fast-element';
import { themeProviderTag } from '../../theme-provider';
import { bodyFont } from '../../theme-provider/design-tokens';
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
): ((source: TSource) => Element) => {
    return (source: TSource): Element => {
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
 *  Renders a FAST `html` template as a story that responds to the
 *  background theme selection in Storybook.
 */
export const createUserSelectedThemeStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource, context: unknown) => Element) => {
    return (source: TSource, context: unknown): Element => {
        const wrappedViewTemplate = html<TSource>`
            <${themeProviderTag}
                theme="${getGlobalTheme(context)}"
                class="code-hide-top-container"
            >
                ${viewTemplate}
            </${themeProviderTag}>
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
): ((source: TSource) => Element) => {
    return (source: TSource): Element => {
        const wrappedViewTemplate = html<TSource>`
            <${themeProviderTag}
                theme="${backgroundState.theme}"
                class="code-hide-top-container"
            >
                <style>
                    body {
                        /* Override storybook's padding styling */
                        padding: 0px !important;
                    }
                </style>
                <div
                    style="
                        background-color: ${backgroundState.value};
                        min-height: 100vh;
                    "
                >
                    ${viewTemplate}
                </div>
            </${themeProviderTag}>
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
): ((source: TSource) => Element) => {
    return (source: TSource): Element => {
        const matrixTemplate = createMatrix(
            ({ theme, value }: BackgroundState) => html`
                <${themeProviderTag}
                    theme="${theme}">
                    <div style="background-color: ${value}; padding:20px;">
                        ${viewTemplate}
                    </div>
                </${themeProviderTag}>
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

export interface IncubatingWarningConfig {
    componentName: string;
    statusLink: string;
}

export const incubatingWarning = (config: IncubatingWarningConfig): string => `
<style class="code-hide">
#incubating-warning {
    color: red;
    font: var(${bodyFont.cssCustomProperty});
}
</style>
<div id="incubating-warning" class="code-hide">
WARNING - The ${config.componentName} is still incubating. It is not recommended for application use. 
See the <a href="${config.statusLink}">incubating component status</a>.
</div>`;

// On Firefox, on the Docs page, there is a div with a scale(1) transform that causes the dropdown
// to be confined to the div. We remove the transform to allow the dropdown to escape the div, but
// that also breaks zooming behavior, so we remove the zoom buttons on the docs page.
export const disableStorybookZoomTransform = `
<style class="code-hide">
    [scale] {
        transform: none !important;
    }
    button[title="Zoom in"],
    button[title="Zoom out"],
    button[title="Reset zoom"] {
        display: none;
    }
</style>
`;

export const anchorTargetGuidelines = `
In general, when adding an anchor element to a web application, the anchor should not have a \`target\` configured on it to control how the link is opened.
Instead, the user should be able to decide how they want to navigate using browser features, such as \`CTRL + Click\` or \`Right-click >> Open New Tab\`. For more information
about when it is appropriate to force users to open links in a new tab or window, see the [WCAG guidelines for opening new tabs and windows](https://www.w3.org/TR/WCAG20-TECHS/G200.html).
Additionally, if an application will open the link in a new tab or window, ensure that is clearly conveyed to the user based on the
[WCAG guidelines for giving users advanced warning when opening a new wwindow](https://www.w3.org/TR/WCAG20-TECHS/G201.html).
`;

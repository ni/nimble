import { html, ViewTemplate } from '@microsoft/fast-element';
import { themeProviderTag } from '../../../nimble-components/src/theme-provider';
import { bodyFont } from '../../../nimble-components/src/theme-provider/design-tokens';
import type { Theme } from '../../../nimble-components/src/theme-provider/types';
import {
    BackgroundState,
    backgroundStates,
    defaultBackgroundState
} from './states';

export const fastParameters = () => ({
    a11y: { disable: true },
    docs: {
        source: {
            code: null
        },
        transformSource: (source: string): string => source
    }
}) as const;

/**
 * Renders a ViewTemplate as elements in a DocumentFragment.
 * Bindings, such as event binding, will be active.
 */
export const renderViewTemplate = <TSource>(
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
    padding-bottom: 16px;
}
</style>
<div id="incubating-warning" class="code-hide">
WARNING - The ${config.componentName} is still incubating. It is not recommended for application use. 
See the <a href="${config.statusLink}">incubating component status</a>.
</div>`;

// On the Docs page, there is a div with a scale(1) transform that causes the dropdown to be
// confined to the div. We remove the transform to allow the dropdown to escape the div, but
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

export const apiCategory = {
    attributes: 'Attributes',
    events: 'Events',
    methods: 'Methods',
    slots: 'Slots'
} as const;

export const iconDescription = 'Set `slot="start"` to include an icon before the text content.';
export const disabledDescription = (options: { componentName: string }): string => `Styles the ${options.componentName} as disabled and prevents focus and user interaction.`;
export const textContentDescription = (options: { componentName: string }): string => `The text content of the ${options.componentName}.`;

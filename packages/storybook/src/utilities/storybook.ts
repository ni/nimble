import { html, ViewTemplate } from '@ni/fast-element';
import { themeProviderTag } from '@ni/nimble-components/dist/esm/theme-provider';
import { bodyFont } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import type { Theme } from '@ni/nimble-components/dist/esm/theme-provider/types';
import { listOptionTag } from '@ni/nimble-components/dist/esm/list-option';
import { listOptionGroupTag } from '@ni/nimble-components/dist/esm/list-option-group';
import {
    type BackgroundState,
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
 * The first element child of the fragment will be returned
 */
export const renderViewTemplate = <TSource>(
    viewTemplate: ViewTemplate<TSource>,
    source: TSource
): Element => {
    const template = document.createElement('template');
    const fragment = template.content;
    viewTemplate.render(source, fragment);
    const content = fragment.firstElementChild!;
    // Capture the outerHTML content before the node is attached to the DOM
    // to workaround outerHTML being called after the element is attached to the DOM
    // https://github.com/ni/nimble/issues/2706
    const value = content.outerHTML;
    Object.defineProperty(content, 'outerHTML', {
        value,
    });
    return content;
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
        const content = renderViewTemplate(wrappedViewTemplate, source);
        return content;
    };
};

const getGlobalTheme = (context: unknown): Theme => {
    type GlobalValue = string | undefined;
    // @ts-expect-error Accessing the global background defined in preview.js
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const globalValue = context?.globals?.backgrounds?.value as GlobalValue;
    const background = backgroundStates.find(({ theme }) => theme === globalValue)
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
        const content = renderViewTemplate(wrappedViewTemplate, source);
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
        const content = renderViewTemplate(wrappedViewTemplate, source);
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
    localizableLabels: 'Localizable Labels',
    methods: 'Methods',
    nonAttributeProperties: 'Properties',
    slots: 'Slots',
    styles: 'Styles'
} as const;

export const appearanceDescription = (options: {
    componentName: string
}): string => `This attribute affects the appearance of the ${options.componentName}.`;
export const fullBleedDescription = (options: {
    componentName: string
}): string => `Removes the start and end margins of the ${options.componentName} causing the text to stretch across the full control width. This property only applies to the frameless appearance.`;
export const iconDescription = 'Set `slot="start"` to include an icon before the text content.';
export const disabledDescription = (options: {
    componentName: string
}): string => `Styles the ${options.componentName} as disabled and prevents focus and user interaction.`;
export const readonlyDescription = (options: {
    componentName: string
}): string => `Styles the ${options.componentName} as readonly and prevents the user from changing the value.`;
export const appearanceReadOnlyDescription = (options: {
    componentName: string
}): string => `Styles the ${options.componentName} as readonly when the component is disabled. This is useful for applications that use a forms library that sets \`disabled\` on components but don't want those components to have a disabled appearance. This property has no impact on the control when it is not disabled.`;
export const slottedLabelDescription = (options: {
    componentName: string
}): string => `Label text to display adjacent to the ${options.componentName} describing its purpose to the user.`;
export const textContentDescription = (options: {
    componentName: string
}): string => `The text content of the ${options.componentName}.`;
export const placeholderDescription = (options: {
    componentName: string
}): string => `Placeholder text to display when no value has been entered in the ${options.componentName}.`;

export const errorTextDescription = 'A message to be displayed explaining why the value is invalid. Only visible when `error-visible` is set.';
export const errorVisibleDescription = 'When set to `true`, an error indicator will be displayed within the control and the `error-text` message will be displayed.';

export const requiredVisibleDescription = 'When set to `true`, an indicator will be displayed within the control to indicate that the field is required. A disabled or readonly control should not also be marked as `required-visible`.';

export const dropdownPositionDescription = (options: {
    componentName: string
}): string => `Controls the position of the dropdown relative to the ${options.componentName}.`;
export const optionsDescription = (options: {
    includeGrouping: boolean
}): string => `The \`${listOptionTag}\` items for the user to select from.${options.includeGrouping ? ` Each ${listOptionTag} can also be grouped using the \`${listOptionGroupTag}\` element.` : ''} `;

export const preventDismissDescription = (options: {
    componentName: string
}): string => `Prevents the \`Esc\` key from closing the ${options.componentName}.`;

export const checkValidityDescription = (options: {
    componentName: string
}): string => `Returns \`true\` if the configuration of the ${options.componentName} is valid, otherwise \`false\`.`;

export const validityDescription = (options: {
    colloquialName: string,
    validityObjectType: string,
    validityFlags: { flagName: string, description: string }[]
}): string => `Readonly object of boolean values that represents the validity states that the ${options.colloquialName}'s configuration can be in.
The object's type is \`${options.validityObjectType}\`, and it contains the following boolean properties:
${options.validityFlags.map(flag => `-   \`${flag.flagName}\`: ${flag.description}`).join('\n')}`;

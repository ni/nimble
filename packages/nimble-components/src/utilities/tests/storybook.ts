import type { ViewTemplate } from '@microsoft/fast-element';

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
 *  Returns a storybook `Story` compatible value to render a FAST `html` template.
 */
export const createRenderer = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource) => Node) => {
    return (source: TSource): Node => {
        const fragment = renderViewTemplate(viewTemplate, source);
        if (fragment.childElementCount !== 1) {
            throw new Error(
                'Template must have a single top-level element containing the full story'
            );
        }
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

import type { ViewTemplate } from '@microsoft/fast-element';

/**
 * Removes all HTML comment nodes.
 */
const removeCommentNodes = (node: Node): void => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeCommentNodes(child));
    }
    if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node);
    }
};

/**
 * Renders a ViewTemplate as elements in a DocumentFragment.
 * Bindings, such as event binding, will be active.
 */
const renderViewTemplate = <TSource>(viewTemplate: ViewTemplate<TSource>, source: TSource): DocumentFragment => {
    const fragment = document.createDocumentFragment();
    viewTemplate.render(source, fragment);
    return fragment;
};

/**
 * Renders a ViewTemplate as an HTML string. The template is evaluated with the `source` context
 * but the resulting elements are discarded. Bindings, such as event bindings, are not
 * serialized in the resulting HTML string.
 */
const renderViewTemplateAsHtml = <TSource>(viewTemplate: ViewTemplate<TSource>, source: TSource): string => {
    const fragment = renderViewTemplate(viewTemplate, source);
    const dummyElement = document.createElement('div');
    dummyElement.append(fragment);
    // FAST inserts HTML comments for binding insertion points which look like <!--fast-11q2o9:1--> that we remove
    removeCommentNodes(dummyElement);
    const html = dummyElement.innerHTML;
    const trimmedHTML = html
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
    return trimmedHTML;
};

/**
 *  Returns a storybook `Story` compatible value to render a FAST `html` template.
 */
export const createRenderer = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource) => string) => {
    return (source: TSource): string => {
        const html = renderViewTemplateAsHtml(viewTemplate, source);
        return html;
    };
};

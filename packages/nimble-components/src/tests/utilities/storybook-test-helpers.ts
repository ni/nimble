import type { ViewTemplate } from '@microsoft/fast-element';

/**
 * Removes all HTML comment nodes. FAST inserts comments which look like <!--fast-11q2o9:1-->
 */
const removeFastCommentNodes = (node: Node): void => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeFastCommentNodes(child));
    }
    if (node.nodeType === 8) {
        node.parentNode!.removeChild(node);
    }
};

/**
 * Consumes the document fragment created from a Fast template by inserting its nodes into a temporary element
 * and renders the element as html. After running the fragment will not have any nodes.
 */
const renderFastFragmentAsHtml = (fragment: DocumentFragment): string => {
    const el = document.createElement('div');
    el.append(fragment);
    removeFastCommentNodes(el);
    const html = el.innerHTML;
    const trimmedHTML = html
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
    return trimmedHTML;
};

export const createRenderer = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource) => string) => {
    return (source: TSource): string => {
        const fragment = document.createDocumentFragment();
        viewTemplate.render(source, fragment);
        const html = renderFastFragmentAsHtml(fragment);
        return html;
    };
};

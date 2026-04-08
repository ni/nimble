import { html as beautifyHTML } from 'js-beautify';

const createFragmentFromHTML = (html: string): DocumentFragment => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    return fragment;
};

const createHTMLFromFragment = (fragment: string | Node): string => {
    const dummyElement = document.createElement('div');
    dummyElement.append(fragment);
    const html = dummyElement.innerHTML;
    return html;
};

const removeClassCodeHideTopNodes = (node: DocumentFragment): void => {
    const target = node.querySelectorAll('.code-hide-top-container');
    if (target.length > 0) {
        const topContainer = target[target.length - 1]!;
        Array
            .from(node.childNodes)
            .forEach(childNode => childNode.remove());
        Array
            .from(topContainer.childNodes)
            .forEach(childNode => node.append(childNode));
    }
};

const removeClassCodeHideNodes = (node: Node): void => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeClassCodeHideNodes(child));
    }
    if (node instanceof HTMLElement && node.classList.contains('code-hide')) {
        node.parentNode?.removeChild(node);
    }
};

// Assume that all remaining class attributes added to nimble elements
//  were added by FAST and are not part of the control api
const removeClassAttributes = (node: Node): void => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeClassAttributes(child));
    }
    if (
        node instanceof HTMLElement
    ) {
        node.removeAttribute('class');
    }
};

// FAST inserts HTML comments for binding insertion points which look
// like <!--fast-11q2o9:1--> or are empty that we remove
const removeFastCommentNodes = (node: Node): void => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeFastCommentNodes(child));
    }
    if (node.nodeType === Node.COMMENT_NODE) {
        const comment = node.textContent!;
        if (comment.includes('fast-') || comment.trim() === '') {
            node.parentNode?.removeChild(node);
        }
    }
};

const removeEmptyAttributes = (html: string): string => html.replaceAll('=""', '');

// Previously used as a custom source transformer. See:
// https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#customizing-source-snippets
export const transformSource = (source: string): string => {
    const fragment = createFragmentFromHTML(source);
    removeFastCommentNodes(fragment);
    removeClassCodeHideNodes(fragment);
    removeClassCodeHideTopNodes(fragment);
    removeClassAttributes(fragment);

    const html = createHTMLFromFragment(fragment);

    const emptyAttributesRemovedHTML = removeEmptyAttributes(html);
    const formattedHTML = beautifyHTML(emptyAttributesRemovedHTML, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wrap_attributes: 'force-expand-multiline',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_preserve_newlines: 0,
    });
    return formattedHTML;
};

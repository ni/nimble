import prettier from 'prettier/esm/standalone';
import parserHTML from 'prettier/esm/parser-html';

const createFragmentFromHTML = html => {
    const template = document.createElement('template');
    template.innerHTML = html;
    const fragment = template.content;
    return fragment;
};

const createHTMLFromFragment = fragment => {
    const dummyElement = document.createElement('div');
    dummyElement.append(fragment);
    const html = dummyElement.innerHTML;
    return html;
};

const removeCodeHideTopContainerNode = node => {
    const topContainer = node.firstElementChild;
    if (topContainer?.classList.contains('code-hide-top-container')) {
        node.removeChild(topContainer);
        const children = Array.from(topContainer.children);
        children.forEach(child => node.append(child));
    }
};

const removeCodeHideNodes = node => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeCodeHideNodes(child));
    }
    if (node instanceof HTMLElement && node.classList.contains('code-hide')) {
        node.parentNode?.removeChild(node);
    }
};

const removeCommentNodes = node => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeCommentNodes(child));
    }
    if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node);
    }
};

const removeClassAttributes = node => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeClassAttributes(child));
    }
    // Assume that all class attributes added to nimble elements were added by FAST
    // and are not part of the control api
    if (node instanceof HTMLElement && node.tagName.toLowerCase().startsWith('nimble-')) {
        node.removeAttribute('class');
    }
};

const removeBlankLines = html => html
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

const removeEmptyAttributes = html => html
    .replaceAll('=""', '');

// A custom source transformer. See:
// https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#customizing-source-snippets
export const transformSource = source => {
    const fragment = createFragmentFromHTML(source);
    // FAST inserts HTML comments for binding insertion points which look
    // like <!--fast-11q2o9:1--> that we remove
    removeCommentNodes(fragment);
    removeCodeHideNodes(fragment);
    removeCodeHideTopContainerNode(fragment);
    removeClassAttributes(fragment);
    const html = createHTMLFromFragment(fragment);

    const trimmedHTML = removeBlankLines(html);
    const emptyAttributesRemovedHTML = removeEmptyAttributes(trimmedHTML);
    const formmattedHTML = prettier.format(emptyAttributesRemovedHTML, {
        parser: 'html',
        plugins: [parserHTML],
        htmlWhitespaceSensitivity: 'ignore',
        tabWidth: 4
    });
    return formmattedHTML;
};

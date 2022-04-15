import '@ni/nimble-tokens/source/fonts.css';
import './preview.css';
import { backgroundStates } from '../dist/esm/utilities/tests/matrix';

const [defaultBackground] = backgroundStates;

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

const removeBlankLines = html => html
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');

// A custom source transformer. See:
// https://github.com/storybookjs/storybook/blob/next/addons/docs/docs/recipes.md#customizing-source-snippets
const transformSource = source => {
    if (source === '') {
        return source;
    }
    const template = document.createElement('template');
    template.innerHTML = source;
    const content = template.content;
    // FAST inserts HTML comments for binding insertion points which look
    // like <!--fast-11q2o9:1--> that we remove
    removeCommentNodes(content);
    removeCodeHideNodes(content);
    const dummyElement = document.createElement('div');
    dummyElement.append(content);
    const html = dummyElement.firstElementChild.classList.contains('code-hide-top-container') ? dummyElement.firstElementChild.innerHTML : dummyElement.innerHTML;
    const trimmedHTML = removeBlankLines(html);
    return trimmedHTML;
};

export const parameters = {
    backgrounds: {
        default: defaultBackground.name,
        values: backgroundStates.map(({ name, value }) => ({ name, value }))
    },
    options: {
        storySort: {
            order: ['Getting Started']
        }
    },
    controls: {
        expanded: true
    },
    docs: {
        transformSource
    }
};

export const decorators = [
    (story, context) => {
        const background = backgroundStates.find(
            ({ value }) => value === context.globals?.backgrounds?.value
        ) ?? defaultBackground;

        const tale = story();
        if (tale instanceof HTMLElement === false) {
            throw new Error('Expected story to render an HTML Element');
        }

        const nimbleThemeProvider = document.createElement('nimble-theme-provider');
        nimbleThemeProvider.setAttribute('theme', background.theme);
        nimbleThemeProvider.append(tale);
        return nimbleThemeProvider;
    }
];

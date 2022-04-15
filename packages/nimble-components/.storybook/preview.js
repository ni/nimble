import '@ni/nimble-tokens/source/fonts.css';
import { backgroundStates } from '../dist/esm/utilities/tests/matrix';

const [defaultBackground] = backgroundStates;

const removeCommentNodes = node => {
    if (node.hasChildNodes()) {
        const nodes = Array.from(node.childNodes);
        nodes.forEach(child => removeCommentNodes(child));
    }
    if (node.nodeType === Node.COMMENT_NODE) {
        node.parentNode?.removeChild(node);
    }
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
        transformSource: source => {
            if (source === '') {
                return source;
            }
            const template = document.createElement('template');
            template.innerHTML = source;
            const content = template.content.firstElementChild;
            // FAST inserts HTML comments for binding insertion points which look
            // like <!--fast-11q2o9:1--> that we remove
            removeCommentNodes(content);
            const html = content.outerHTML;
            const trimmedHTML = html
                .split('\n')
                .filter(line => line.trim() !== '')
                .join('\n');
            return trimmedHTML;
        }
    }
};

export const decorators = [
    (story, context) => {
        const background = backgroundStates.find(
            ({ value }) => value === context.globals?.backgrounds?.value
        ) ?? defaultBackground;
        const tale = story();
        if (tale instanceof Node) {
            const nimbleThemeProvider = document.createElement('nimble-theme-provider');
            nimbleThemeProvider.setAttribute('theme', background.theme);
            nimbleThemeProvider.append(tale);
            return nimbleThemeProvider;
        }
        throw new Error('Expected story to render as string or as a Node');
    }
];

import '@ni/nimble-tokens/source/space-mono-font-face.css';
import '@ni/nimble-tokens/source/source-sans-pro-font-face.css';
import '../dist/esm/theme-provider';
import { backgroundStates } from '../dist/esm/tests/utilities/theme-test-helpers';

const [defaultBackground] = backgroundStates;

export const parameters = {
    layout: 'fullscreen',
    backgroundStates: {
        default: defaultBackground.name,
        values: backgroundStates.map(({ name, value }) => ({ name, value }))
    },
    options: {
        storySort: {
            order: ['Getting Started']
        }
    }
};

export const decorators = [
    (story, context) => {
        const background = backgroundStates.find(
            ({ value }) => value === context.globals?.backgrounds?.value
        ) ?? defaultBackground;
        const tale = story();
        if (typeof tale === 'string') {
            return `<nimble-theme-provider theme="${background.theme}">${tale}</nimble-theme-provider>`;
        }
        if (tale instanceof Node) {
            const nimbleThemeProvider = document.createElement('nimble-theme-provider');
            nimbleThemeProvider.setAttribute('theme', background.theme);
            nimbleThemeProvider.append(tale);
            return nimbleThemeProvider;
        }
        throw new Error('Expected story to render as string or as a Node');
    }
];

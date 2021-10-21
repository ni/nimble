import '@ni/nimble-tokens/source/space-mono-font-face.css';
import '@ni/nimble-tokens/source/source-sans-pro-font-face.css';
import '../dist/esm/theme-provider';
import { backgroundStates } from '../dist/esm/tests/utilities/theme-test-helpers';

const [defaultBackground] = backgroundStates;

export const parameters = {
    layout: 'fullscreen',
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
        throw new Error('Expected story to render as string or as a Node');
    }
];

import '@ni/nimble-tokens/source/fonts.css';
import '../dist/esm/theme-provider';
import { backgroundStates } from '../dist/esm/utilities/tests/matrix';

const [defaultBackground] = backgroundStates;

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
    }
};

export const decorators = [
    (story, context) => {
        const background = backgroundStates.find(
            ({ value }) => value === context.globals?.backgrounds?.value
        ) ?? defaultBackground;
        const tale = story();
        if (typeof tale !== 'string') {
            throw new Error('Expected story to render as string');
        }
        return `<nimble-theme-provider theme="${background.theme}">${tale}</nimble-theme-provider>`;
    }
];

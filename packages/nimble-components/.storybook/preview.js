import '@ni/nimble-tokens/source/fonts.css';
import './preview.css';
import { transformSource } from './transformSource';
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

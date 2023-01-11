import '@ni/nimble-tokens/dist/fonts/css/fonts.css';
import './preview.css';
import { transformSource } from './transformSource';
// import { backgroundStates, defaultBackgroundState } from '../dist/esm/utilities/tests/states';

export const parameters = {
    // backgrounds: {
    //     default: defaultBackgroundState.name,
    //     values: backgroundStates.map(({ name, value }) => ({ name, value }))
    // },
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

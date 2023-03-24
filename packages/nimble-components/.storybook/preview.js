import { configureActions } from '@storybook/addon-actions';
import '@ni/nimble-tokens/dist/fonts/css/fonts.css';
import './preview.css';
import { transformSource } from './transformSource';
import { backgroundStates, defaultBackgroundState } from '../dist/esm/utilities/tests/states';

export const parameters = {
    backgrounds: {
        default: defaultBackgroundState.name,
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

// Storybook's default serialization of events includes the serialized event target. This can
// be quite large, such as in a table with a lot of records. Therefore, the serialization depth
// should be limited to avoid poor performance.
configureActions({
    depth: 6
});

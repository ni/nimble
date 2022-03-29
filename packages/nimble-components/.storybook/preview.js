import '@ni/nimble-tokens/source/fonts.css';
import './background.css';
import { backgroundStates } from '../dist/esm/utilities/tests/matrix';

const items = backgroundStates.map(({ name, theme }) => ({ value: theme, title: name }));
const defaultValue = items[0].value;

export const parameters = {
    backgrounds: {
        disable: true
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

export const globalTypes = {
    nimbleTheme: {
        name: 'Nimble Theme',
        description: 'Nimble Theme selector',
        defaultValue,
        toolbar: {
            hidden: true,
            icon: 'photo',
            items
        }
    }
};

export const decorators = [
    (story, context) => {
        const theme = context.globals.nimbleTheme;
        const tale = story();
        if (typeof tale !== 'string') {
            throw new Error('Expected story to render as string');
        }
        return `<nimble-theme-provider apply-to-body theme="${theme}"></nimble-theme-provider>${tale}`;
    }
];

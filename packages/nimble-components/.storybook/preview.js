import '@ni/nimble-tokens/source/fonts.css';
import './background.css';

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
        defaultValue: 'light',
        toolbar: {
            icon: 'photo',
            items: [
                { value: 'light', title: 'Light Theme' },
                { value: 'dark', title: 'Dark Theme' },
                { value: 'color', title: 'Color Theme' },
                { value: 'prefers-color-scheme', title: 'User-preferred Theme' }
            ]
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

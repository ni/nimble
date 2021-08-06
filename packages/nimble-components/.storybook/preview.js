import { addDecorator } from '@storybook/html';

import '@ni/nimble-tokens/source/space-mono-font-face.css';
import '@ni/nimble-tokens/source/source-sans-pro-font-face.css';
import '../dist/esm/theme-provider';
import { NimbleTheme } from '../dist/esm/theme-provider/themes';

const nimbleThemes = Object.values(NimbleTheme);

export const parameters = {
    layout: 'fullscreen',
    backgrounds: {
        values: [
            {
                name: 'light-ui',
                value: '#F4F4F4'
            },
            {
                name: 'green-ui',
                value: '#03B585'
            },
            {
                name: 'dark-green-ui',
                value: '#044123'
            },
            {
                name: 'dark-ui',
                value: '#252526'
            }
        ]
    }
};

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: NimbleTheme.Light,
        toolbar: {
            icon: 'circlehollow',
            // array of plain string values for theme.
            items: nimbleThemes
        }
    }
};

const storyAsString = (story, theme) => `<nimble-theme-provider theme="${theme}">${story}</nimble-theme-provider>`;

const storyAsNode = story => {
    const wrapper = document.createElement('nimble-theme-provider');
    // wrapper.attributes = [theme]; TODO - develop with real component
    wrapper.appendChild(story);
    return wrapper;
};

addDecorator((story, context) => {
    const tale = story();
    const theme = context?.globals?.theme || NimbleTheme.Light;
    return typeof tale === 'string'
        ? storyAsString(tale, theme)
        : storyAsNode(tale, theme);
});

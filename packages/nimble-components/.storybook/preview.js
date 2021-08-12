import '@ni/nimble-tokens/source/space-mono-font-face.css';
import '@ni/nimble-tokens/source/source-sans-pro-font-face.css';
import '../dist/esm/theme-provider';
import { NimbleTheme } from '../dist/esm/theme-provider/themes';

const backgrounds = [
    {
        name: `"${NimbleTheme.Light}" theme on white`,
        value: '#F4F4F4',
        theme: NimbleTheme.Light
    },
    {
        name: `"${NimbleTheme.Color}" theme on green`,
        value: '#03B585',
        theme: NimbleTheme.Color
    },
    {
        name: `"${NimbleTheme.Color}" theme on dark green`,
        value: '#044123',
        theme: NimbleTheme.Color
    },
    {
        name: `"${NimbleTheme.Dark}" theme on black`,
        value: '#252526',
        theme: NimbleTheme.Dark
    }
];

const [defaultBackground] = backgrounds;

export const parameters = {
    layout: 'fullscreen',
    backgrounds: {
        default: defaultBackground.name,
        values: backgrounds.map(({ name, value }) => ({ name, value }))
    }
};

export const decorators = [
    (story, context) => {
        const background = backgrounds.find(({ value }) => value === context.globals?.backgrounds?.value) ?? defaultBackground;
        const tale = story();
        if (typeof tale !== 'string') {
            throw new Error('Expected story to render as string');
        }
        return `<nimble-theme-provider theme="${background.theme}">${tale}</nimble-theme-provider>`;
    }
];

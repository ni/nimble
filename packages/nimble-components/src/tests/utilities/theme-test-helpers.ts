import { NimbleTheme } from '../../theme-provider/themes';

export const backgrounds: {
    name: string,
    value: string,
    theme: string
}[] = [
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
    },
    {
        name: `"${NimbleTheme.LegacyBlue}" theme on white`,
        value: '#FFFFFF',
        theme: NimbleTheme.LegacyBlue
    }
];

export function matrixThemeWrapper(components: string): string {
    return `${backgrounds
        .map(
            background => `
    <nimble-theme-provider theme="${background.theme}">
        <div style="background-color: ${background.value}; padding:20px;">
            ${components}
        </div>
    </nimble-theme-provider>
`
        )
        .join('')}`;
}

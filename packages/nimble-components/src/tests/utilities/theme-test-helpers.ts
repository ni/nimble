import { NimbleTheme } from '../../theme-provider/themes';

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
    },
    {
        name: `"${NimbleTheme.LegacyBlue}" theme on white`,
        value: '#FFFFFF',
        theme: NimbleTheme.LegacyBlue
    }
];
type Background = typeof backgrounds[number];

export const disabledStates = [
    ['', ''],
    ['Disabled', 'disabled']
];
export type DisabledState = typeof disabledStates[number];

export function matrixThemeWrapper(components: () => string): string;

export function matrixThemeWrapper<State1>(
    components: (state1: State1) => string,
    dimensions: [State1[]]
): string;

export function matrixThemeWrapper<State1, State2>(
    components: (state1: State1, state2: State2) => string,
    dimensions: [State1[], State2[]]
): string;

export function matrixThemeWrapper<State1, State2, State3>(
    components: (state1: State1, state2: State2, state3: State3) => string,
    dimensions: [State1[], State2[], State3[]]
): string;

export function matrixThemeWrapper<State1, State2, State3, State4>(
    components: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4
    ) => string,
    dimensions: [State1[], State2[], State3[], State3[]]
): string;

export function matrixThemeWrapper(
    components: (...states: unknown[]) => string,
    dimensions?: unknown[][]
): string {
    const matrix: string[] = [];
    const recurseDimensions = (
        currentDimensions?: unknown[][],
        ...states
    ): void => {
        if (currentDimensions && currentDimensions.length >= 1) {
            const [currentDimension, ...remainingDimensions] = currentDimensions;
            for (const value of currentDimension) {
                recurseDimensions(remainingDimensions, ...states, value);
            }
        } else {
            matrix.push(components(...states));
        }
    };
    recurseDimensions(dimensions);

    const themeWrapper = (background: Background): string => `
        <nimble-theme-provider theme="${background.theme}">
            <div style="background-color: ${background.value}; padding:20px;">
                ${matrix.join('')}
            </div>
        </nimble-theme-provider>`;
    const story = backgrounds.map(themeWrapper).join('');
    return story;
}

import { search16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { NimbleTheme } from '../../theme-provider/themes';

export const backgrounds = [
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

export const invalidStates = [
    ['', ''],
    ['Invalid', 'invalid']
];
export type InvalidState = typeof invalidStates[number];

export const readOnlyStates = [
    ['', ''],
    ['Read-Only', 'readonly']
];
export type ReadOnlyState = typeof readOnlyStates[number];

export const iconStates = ['', `<div slot="icon">${search16X16.data}</div>`];
export type IconState = typeof iconStates[number];

/**
 * Wraps a given component template with a region for each of the available themes.
 * Takes an optional array of state values that can be used with the template to match the permutations of the provided states.
 */
export function matrixThemeWrapper(component: () => string): string;

export function matrixThemeWrapper<State1>(
    component: (state1: State1) => string,
    dimensions: [State1[]]
): string;

export function matrixThemeWrapper<State1, State2>(
    component: (state1: State1, state2: State2) => string,
    dimensions: [State1[], State2[]]
): string;

export function matrixThemeWrapper<State1, State2, State3>(
    component: (state1: State1, state2: State2, state3: State3) => string,
    dimensions: [State1[], State2[], State3[]]
): string;

export function matrixThemeWrapper<State1, State2, State3, State4>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4
    ) => string,
    dimensions: [State1[], State2[], State3[], State4[]]
): string;

export function matrixThemeWrapper<State1, State2, State3, State4, State5>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5
    ) => string,
    dimensions: [State1[], State2[], State3[], State4[], State5[]]
): string;

export function matrixThemeWrapper(
    component: (...states: unknown[]) => string,
    dimensions?: unknown[][]
): string {
    const matrix: string[] = [];
    const recurseDimensions = (
        currentDimensions?: unknown[][],
        ...states: unknown[]
    ): void => {
        if (currentDimensions && currentDimensions.length >= 1) {
            const [currentDimension, ...remainingDimensions] = currentDimensions;
            for (const currentState of currentDimension) {
                recurseDimensions(remainingDimensions, ...states, currentState);
            }
        } else {
            matrix.push(component(...states));
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

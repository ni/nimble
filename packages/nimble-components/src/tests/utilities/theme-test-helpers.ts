import { html, repeat, ViewTemplate } from '@microsoft/fast-element';
import { controlsSearch16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { NimbleTheme } from '../../theme-provider/themes';

interface Background {
    name: string;
    value: string;
    theme: NimbleTheme;
}

export const lightThemeWhiteBackground: Background = {
    name: `"${NimbleTheme.Light}" theme on white`,
    value: '#F4F4F4',
    theme: NimbleTheme.Light
};

export const colorThemeGreenBackground: Background = {
    name: `"${NimbleTheme.Color}" theme on green`,
    value: '#03B585',
    theme: NimbleTheme.Color
};

export const colorThemeDarkGreenBackground: Background = {
    name: `"${NimbleTheme.Color}" theme on dark green`,
    value: '#044123',
    theme: NimbleTheme.Color
};

export const darkThemeBlackBackground: Background = {
    name: `"${NimbleTheme.Dark}" theme on black`,
    value: '#252526',
    theme: NimbleTheme.Dark
};

export const legacyBlueThemeWhiteBackground: Background = {
    name: `"${NimbleTheme.LegacyBlue}" theme on white`,
    value: '#FFFFFF',
    theme: NimbleTheme.LegacyBlue
};

export const backgrounds: Background[] = [
    lightThemeWhiteBackground,
    colorThemeGreenBackground,
    colorThemeDarkGreenBackground,
    darkThemeBlackBackground,
    legacyBlueThemeWhiteBackground
];

export type DisabledState = [string, boolean];
export const disabledStates: DisabledState[] = [
    ['', false],
    ['Disabled', true]
];

export type InvalidState = [string, string];
export const invalidStates: InvalidState[] = [
    ['', ''],
    ['Invalid', 'invalid']
];

export type ReadOnlyState = [string, boolean];
export const readOnlyStates: ReadOnlyState[] = [
    ['', false],
    ['Read-Only', true]
];

export type IconState = ViewTemplate;
export const iconStates: ViewTemplate[] = [
    // An empty template requires a space to prevent errors
    // prettier-ignore
    html` `,
    html`<div slot="icon">${controlsSearch16X16.data}</div>`
];

export type ExpandedState = [string, boolean];
export const expandedStates: ExpandedState[] = [
    ['Collapsed', false],
    ['Expanded', true]
];

export type SelectedState = [string, boolean];
export const selectedStates: SelectedState[] = [
    ['Unselected', false],
    ['Selected', true]
];

/**
 * Takes an array of state values that can be used with the template to match the permutations of the provided states.
 */
export function createMatrix(component: () => ViewTemplate): ViewTemplate;

export function createMatrix<State1>(
    component: (state1: State1) => ViewTemplate,
    dimensions: [State1[]]
): ViewTemplate;

export function createMatrix<State1, State2>(
    component: (state1: State1, state2: State2) => ViewTemplate,
    dimensions: [State1[], State2[]]
): ViewTemplate;

export function createMatrix<State1, State2, State3>(
    component: (state1: State1, state2: State2, state3: State3) => ViewTemplate,
    dimensions: [State1[], State2[], State3[]]
): ViewTemplate;

export function createMatrix<State1, State2, State3, State4>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4
    ) => ViewTemplate,
    dimensions: [State1[], State2[], State3[], State4[]]
): ViewTemplate;

export function createMatrix<State1, State2, State3, State4, State5>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5
    ) => ViewTemplate,
    dimensions: [State1[], State2[], State3[], State4[], State5[]]
): ViewTemplate;

export function createMatrix(
    component: (...states: unknown[]) => ViewTemplate,
    dimensions?: unknown[][]
): ViewTemplate {
    const matrix: ViewTemplate[] = [];
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
    // prettier-ignore
    return html`
        ${repeat(() => matrix, html`
            ${(x: ViewTemplate): ViewTemplate => x}
        `)}
    `;
}

/**
 * Wraps a given component template with a region for each of the input backgrounds/themes.
 * @param themes The set of themes to use (if unspecified, will use all available backgrounds/themes)
 */
// prettier-ignore
export const themeWrapper = (template: ViewTemplate, backgroundsThemes: Background[]): ViewTemplate => html`
    ${repeat(() => backgroundsThemes, html<Background>`
    <nimble-theme-provider theme="${x => x.theme}">
        <div style="background-color: ${x => x.value}; padding:20px;">
            ${template}
        </div>
    </nimble-theme-provider>
    `)}
`;

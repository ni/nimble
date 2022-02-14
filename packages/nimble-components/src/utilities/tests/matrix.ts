import { html, repeat, ViewTemplate } from '@microsoft/fast-element';
import { Theme } from '../../theme-provider/types';

export interface BackgroundState {
    name: string;
    value: string;
    theme: Theme;
}

export const backgroundStates: BackgroundState[] = [
    {
        name: `"${Theme.Light}" theme on white`,
        value: '#F4F4F4',
        theme: Theme.Light
    },
    {
        name: `"${Theme.Color}" theme on dark green`,
        value: '#044123',
        theme: Theme.Color
    },
    {
        name: `"${Theme.Dark}" theme on black`,
        value: '#252526',
        theme: Theme.Dark
    },
    {
        name: `"${Theme.LegacyBlue}" theme on white`,
        value: '#FFFFFF',
        theme: Theme.LegacyBlue
    }
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

export type IconVisibleState = boolean;
export const iconVisibleStates: IconVisibleState[] = [false, true];

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

export function createMatrix<State1, State2, State3, State4, State5, State6>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5,
        state6: State6
    ) => ViewTemplate,
    dimensions: [State1[], State2[], State3[], State4[], State5[], State6[]]
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
 * Wraps a given component template with a region for each of the available themes.
 */
export const themeWrapper = (template: ViewTemplate): ViewTemplate => createMatrix(
    ({ theme, value }: BackgroundState) => html`
            <nimble-theme-provider theme="${theme}">
                <div style="background-color: ${value}; padding:20px;">
                    ${template}
                </div>
            </nimble-theme-provider>
        `,
    [backgroundStates]
);

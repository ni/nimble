import { html, repeat, ViewTemplate } from '@microsoft/fast-element';
import { Theme } from '../../theme-provider/types';

export const backgroundStates = [
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
    }
] as const;

export type BackgroundState = typeof backgroundStates[number];

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
    dimensions: readonly [readonly State1[]]
): ViewTemplate;

export function createMatrix<State1, State2>(
    component: (state1: State1, state2: State2) => ViewTemplate,
    dimensions: readonly [readonly State1[], readonly State2[]]
): ViewTemplate;

export function createMatrix<State1, State2, State3>(
    component: (state1: State1, state2: State2, state3: State3) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[]
    ]
): ViewTemplate;

export function createMatrix<State1, State2, State3, State4>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4
    ) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[]
    ]
): ViewTemplate;

export function createMatrix<State1, State2, State3, State4, State5>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5
    ) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[],
        readonly State5[]
    ]
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
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[],
        readonly State5[],
        readonly State6[]
    ]
): ViewTemplate;

export function createMatrix<
    State1,
    State2,
    State3,
    State4,
    State5,
    State6,
    State7
>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5,
        state6: State6,
        state7: State7
    ) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[],
        readonly State5[],
        readonly State6[],
        readonly State7[]
    ]
): ViewTemplate;

export function createMatrix(
    component: (...states: readonly unknown[]) => ViewTemplate,
    dimensions?: readonly (readonly unknown[])[]
): ViewTemplate {
    const matrix: ViewTemplate[] = [];
    const recurseDimensions = (
        currentDimensions?: readonly (readonly unknown[])[],
        ...states: readonly unknown[]
    ): void => {
        if (currentDimensions && currentDimensions.length >= 1) {
            const [currentDimension, ...remainingDimensions] = currentDimensions;
            for (const currentState of currentDimension!) {
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
export const themeWrapper = (template: ViewTemplate): ViewTemplate => html`
<div style="display: contents">
    ${createMatrix(
        ({ theme, value }: BackgroundState) => html`
                <nimble-theme-provider theme="${theme}">
                    <div style="background-color: ${value}; padding:20px;">
                        ${template}
                    </div>
                </nimble-theme-provider>
            `,
        [backgroundStates]
    )}
</div>
`;

// A customized theme wrapper (not themeWrapper like the other controls) so we can create different stories for each theme, rather
// than having a single Theme Matrix story. This is useful for when the UI under test can't be tested multiple times on a
// single page, but you still want to test the UI for each theme.
export const singleThemeWrapper = (
    template: ViewTemplate,
    backgroundState: BackgroundState
): ViewTemplate => html`
    <nimble-theme-provider theme="${backgroundState.theme}">
        <div
            style="
                background-color: ${backgroundState.value};
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
            "
        ></div>
        ${template}
    </nimble-theme-provider>
`;

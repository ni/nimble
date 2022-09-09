import { html, repeat, ViewTemplate } from '@microsoft/fast-element';

export const sharedMatrixParameters = () => ({
    controls: {
        hideNoControlsWarning: true
    },
    a11y: { disabled: true },
    docs: {
        source: {
            code: null
        },
        transformSource: (source: string): string => source
    },
    backgrounds: {
        disable: true,
        grid: {
            disable: true
        }
    },
    viewMode: 'story',
    previewTabs: {
        'storybook/docs/panel': {
            hidden: true
        }
    }
} as const);

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

export function createMatrix<
    State1,
    State2,
    State3,
    State4,
    State5,
    State6,
    State7,
    State8
>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5,
        state6: State6,
        state7: State7,
        state8: State8
    ) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[],
        readonly State5[],
        readonly State6[],
        readonly State7[],
        readonly State8[]
    ]
): ViewTemplate;

export function createMatrix<
    State1,
    State2,
    State3,
    State4,
    State5,
    State6,
    State7,
    State8,
    State9
>(
    component: (
        state1: State1,
        state2: State2,
        state3: State3,
        state4: State4,
        state5: State5,
        state6: State6,
        state7: State7,
        state8: State8,
        state9: State9
    ) => ViewTemplate,
    dimensions: readonly [
        readonly State1[],
        readonly State2[],
        readonly State3[],
        readonly State4[],
        readonly State5[],
        readonly State6[],
        readonly State7[],
        readonly State8[],
        readonly State9[]
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

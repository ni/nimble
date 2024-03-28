import { html, repeat, ViewTemplate } from '@microsoft/fast-element';
import { fastParameters, renderViewTemplate } from './storybook';
import { themeProviderTag } from '../../theme-provider';
import { type BackgroundState, backgroundStates } from './states';
import { bodyFont, bodyFontColor } from '../../theme-provider/design-tokens';

export const sharedMatrixParameters = () => ({
    ...fastParameters(),
    controls: {
        hideNoControlsWarning: true
    },
    backgrounds: {
        disable: true,
        grid: {
            disable: true
        }
    },
    viewMode: 'story',
    previewTabs: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'storybook/docs/panel': {
            hidden: true
        }
    }
}) as const;

type MakeTupleEntriesArrays<T> = { [K in keyof T]: readonly T[K][] };

/**
 * Calculates the cartesian product of an array of sets.
 */
export function cartesianProduct<T extends readonly unknown[]>(
    dimensions?: MakeTupleEntriesArrays<T>
): [...T][] {
    const result: [...T][] = [];
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
            result.push(states as [...T]);
        }
    };
    recurseDimensions(dimensions);
    return result;
}

/**
 * Passes each of the given state combinations into a template function and returns the combined output.
 */
function createMatrixFromStates<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    states: T[]
): ViewTemplate {
    // prettier-ignore
    return html`
    ${repeat(() => states, html`
        ${(x: T): ViewTemplate => component(...x)}
    `)}
`;
}

/**
 * Creates a template that renders all combinations of states in the given dimensions.
 */
export function createMatrix<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    dimensions?: MakeTupleEntriesArrays<T>
): ViewTemplate {
    const states = cartesianProduct(dimensions);
    return createMatrixFromStates(component, states);
}

/**
 *  Renders a FAST `html` template for each theme.
 */
export const createMatrixThemeStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource) => Element) => {
    return (source: TSource): Element => {
        const matrixTemplate = createMatrix(
            ({ theme, value }: BackgroundState) => html`
                <${themeProviderTag}
                    theme="${theme}">
                    <div style="background-color: ${value}; padding:20px;">
                        ${viewTemplate}
                    </div>
                </${themeProviderTag}>
            `,
            [backgroundStates]
        );
        const wrappedMatrixTemplate = html<TSource>`
            <div class="code-hide-top-container">${matrixTemplate}</div>
        `;
        const fragment = renderViewTemplate(wrappedMatrixTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

export function createMatrixInteractionsFromStates<
    THover extends readonly unknown[],
    THoverActive extends readonly unknown[],
    TActive extends readonly unknown[],
    TFocus extends readonly unknown[]
>(
    component: (
        ...states: THover | TActive | THoverActive | TFocus
    ) => ViewTemplate,
    states: {
        hover: THover[],
        hoverActive: THoverActive[],
        active: TActive[],
        focus: TFocus[]
    }
): ViewTemplate {
    // prettier-ignore
    return html`
    <div style="
        font: var(${bodyFont.cssCustomProperty});
        color: var(${bodyFontColor.cssCustomProperty});
    ">
        <div class="pseudo-hover-all">
            <p>Hover</p>
            ${createMatrixFromStates(component, states.hover)}
        </div>
        <div class="pseudo-hover-all pseudo-active-all">
            <p>Hover and active</p>
            ${createMatrixFromStates(component, states.hoverActive)}
        </div>
        <div class="pseudo-active-all">
            <p>Active</p>
            ${createMatrixFromStates(component, states.active)}
        </div>
        <div class="pseudo-focus-visible-all pseudo-focus-within-all">
            <p>Focus</p>
            ${createMatrixFromStates(component, states.focus)}
        </div>
    </div>
`;
}

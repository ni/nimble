import { html, repeat, ViewTemplate } from '@microsoft/fast-element';
import { fastParameters, renderViewTemplate } from './storybook';
import { themeProviderTag } from '../../theme-provider';
import { type BackgroundState, backgroundStates } from './states';

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
 * Takes a template rendered with an array of states.
 */
export function createMatrixFromStates<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    states: T[]
): ViewTemplate {
    const matrix = states.map(state => component(...state));
    // prettier-ignore
    return html`
    ${repeat(() => matrix, html`
        ${(x: ViewTemplate): ViewTemplate => x}
    `)}
`;
}

/**
 * Takes a template rendered with the cartesian product the provided states.
 */
export function createMatrix<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    dimensions?: MakeTupleEntriesArrays<T>,
    filter?: (...states: T) => boolean
): ViewTemplate {
    const states = cartesianProduct(dimensions).filter(
        state => !filter || filter(...state)
    );
    return createMatrixFromStates(component, states);
}

/**
 *  Renders a FAST `html` template for each theme.
 */
export const createMatrixThemeStory = <TSource>(
    viewTemplate: ViewTemplate<TSource>
): ((source: TSource) => Element) => {
    return (source: TSource): Element => {
        const component = ({
            theme,
            value
        }: BackgroundState): ViewTemplate => html`
            <${themeProviderTag}
                theme="${theme}">
                <div style="background-color: ${value}; padding:20px;">
                    ${viewTemplate}
                </div>
            </${themeProviderTag}>
        `;
        const matrixTemplate = createMatrix(component, [backgroundStates]);
        const wrappedMatrixTemplate = html<TSource>`
            <div class="code-hide-top-container">${matrixTemplate}</div>
        `;
        const fragment = renderViewTemplate(wrappedMatrixTemplate, source);
        const content = fragment.firstElementChild!;
        return content;
    };
};

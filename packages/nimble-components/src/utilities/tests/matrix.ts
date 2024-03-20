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
 * Takes an array of state values and finds the permutations of the provided states.
 */
function permute<T extends readonly unknown[]>(
    dimensions?: MakeTupleEntriesArrays<T>
): T[] {
    const permutations: T[] = [];
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
            permutations.push(states as T);
        }
    };
    recurseDimensions(dimensions);
    return permutations;
}

/**
 * Takes an array of state values that can be used with the template to match the permutations of the provided states.
 */
export function createMatrix<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    dimensions?: MakeTupleEntriesArrays<T>,
    filter?: (...states: T) => boolean
): ViewTemplate {
    const matrix = permute(dimensions)
        .filter(states => !filter || filter(...states))
        .map(states => component(...states));
    // prettier-ignore
    return html`
        ${repeat(() => matrix, html`
            ${(x: ViewTemplate): ViewTemplate => x}
        `)}
    `;
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

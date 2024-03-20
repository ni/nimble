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

/**
 * Takes an array of state values that can be used with the template to match the permutations of the provided states.
 */
type MakeTupleEntriesArrays<T> = { [K in keyof T]: readonly T[K][] };
export function createMatrix<T extends readonly unknown[]>(
    component: (...states: T) => ViewTemplate,
    dimensions?: MakeTupleEntriesArrays<T>,
    filter?: (...states: T) => boolean
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
        } else if (!filter || filter(...states as T)) {
            matrix.push(component(...states as T));
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

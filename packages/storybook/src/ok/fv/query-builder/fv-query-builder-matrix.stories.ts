import type { Meta, StoryFn } from '@storybook/html-vite';
import { html, ref } from '@ni/fast-element';
import { fvQueryBuilderTag } from '@ni/ok-components/dist/esm/fv/query-builder';
import { createUserSelectedThemeStory, disableStorybookZoomTransform, okWarning } from '../../../utilities/storybook';
import { cloneDocument, queryBuilderDefinition, queryBuilderOperandExamples } from './fixtures';

interface MatrixSource {
    container?: HTMLDivElement;
}

const template = html<MatrixSource>`
    ${okWarning({
        componentName: 'fv query builder',
        statusLink: './?path=/docs/component-status--docs#ok-components'
    })}
    ${disableStorybookZoomTransform}
    <div ${ref('container')} style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr)); gap: 16px; padding: 16px; box-sizing: border-box;"></div>
`;

const metadata: Meta = {
    title: 'Tests Ok/Fv Query Builder'
};

export default metadata;

export const operandMatrix: StoryFn = (_args, context) => {
    const source: MatrixSource = {};
    const result = createUserSelectedThemeStory(template)(source, context);
    if (!source.container) {
        throw new Error('Story template did not create the matrix container.');
    }

    for (const example of queryBuilderOperandExamples) {
        const cell = document.createElement('section');
        cell.style.display = 'flex';
        cell.style.flexDirection = 'column';
        cell.style.gap = '8px';
        cell.style.minWidth = '0';
        const heading = document.createElement('h3');
        heading.textContent = example.name;
        heading.style.fontSize = '14px';
        heading.style.margin = '0';
        const builder = document.createElement(fvQueryBuilderTag);
        builder.label = example.name;
        builder.definition = queryBuilderDefinition;
        builder.query = cloneDocument(example.query);
        cell.append(heading, builder);
        source.container.append(cell);
    }

    return result;
};
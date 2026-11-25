import { html } from '@ni/fast-element';
import type { Meta, StoryObj } from '@storybook/html-vite';
import { createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';
import { mountPlotlyExample, mountTanStackExample } from './graph-theming.stories';

const metadata: Meta = {
    title: 'Tests Ok/Graph Theming',
    parameters: sharedMatrixParameters()
};

export default metadata;

export const themeMatrix: StoryObj = {
    render: createMatrixThemeStory(html`
        <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px;">
            <div data-tanstack></div>
            <div data-plotly></div>
        </div>
    `),
    play: async ({ canvasElement, abortSignal }) => {
        for (const chart of canvasElement.querySelectorAll<HTMLElement>('[data-tanstack]')) {
            mountTanStackExample(chart, abortSignal, 'bar');
        }
        await Promise.all(Array.from(
            canvasElement.querySelectorAll<HTMLElement>('[data-plotly]'),
            async chart => await mountPlotlyExample(chart, abortSignal, 'markers')
        ));
    }
};

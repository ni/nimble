import { html } from '@ni/fast-element';
import type { Meta, StoryFn, StoryObj } from '@storybook/html-vite';
import Plotly from 'plotly.js-dist-min';
import { fvChartPlotlyTag } from '@ni/ok-components/dist/esm/fv/chart-plotly';
import { createMatrixThemeStory, sharedMatrixParameters } from '../../../utilities/matrix';
import { barData, barLayout, lineData, lineLayout } from './fv-chart-plotly.stories';

const metadata: Meta = {
    title: 'Tests Ok/Fv Chart Plotly',
    parameters: { ...sharedMatrixParameters() }
};

export default metadata;

const charts = html`
    <${fvChartPlotlyTag} style="width: 600px;" :data="${() => lineData}" :layout="${() => lineLayout}"></${fvChartPlotlyTag}>
    <${fvChartPlotlyTag} style="width: 320px;" :data="${() => barData}" :layout="${() => barLayout}"></${fvChartPlotlyTag}>
`;

const plotted = async (canvasElement: HTMLElement): Promise<void> => {
    await document.fonts.ready;
    await Promise.all(Array.from(canvasElement.querySelectorAll(fvChartPlotlyTag), async chart => {
        if (!chart.shadowRoot!.querySelector('.main-svg')) {
            await new Promise(resolve => {
                chart.addEventListener('plotly_afterplot', resolve, { once: true });
            });
        }
    }));
};

export const themeMatrix: StoryObj = {
    render: createMatrixThemeStory(charts),
    play: async ({ canvasElement }): Promise<void> => await plotted(canvasElement)
};

export const tooltipThemeMatrix: StoryObj = {
    render: createMatrixThemeStory(charts),
    play: async ({ canvasElement }): Promise<void> => {
        await plotted(canvasElement);
        // Fx.hover is Plotly's public API for programmatic hover but is missing from its type declarations.
        const fx = Reflect.get(Plotly, 'Fx') as { hover: (plot: HTMLElement, points: { curveNumber: number, pointNumber: number }[]) => void };
        canvasElement.querySelectorAll(fvChartPlotlyTag).forEach(chart => {
            fx.hover(chart.chartContainer, [{ curveNumber: 0, pointNumber: 1 }]);
        });
    }
};

export const emptyState: StoryFn = createMatrixThemeStory(html`
    <${fvChartPlotlyTag} style="width: 320px;" :data="${() => []}" :layout="${() => barLayout}"></${fvChartPlotlyTag}>
`);

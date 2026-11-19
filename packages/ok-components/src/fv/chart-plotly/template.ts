import { html, ref } from '@ni/fast-element';
import type { FvChartPlotly } from '.';

export const template = html<FvChartPlotly>`
    <div ${ref('chartContainer')} part="chart"></div>
`;

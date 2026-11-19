import type { Data, Layout } from 'plotly.js-dist-min';

export interface PlotlyExample {
    title: string;
    type: string;
    data: Data[];
    layout?: Partial<Layout>;
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const xs = Array.from({ length: 40 }, (_, i) => i / 4);
const wave = (phase: number): number[] => xs.map(x => Math.sin(x + phase) * 10 + 20 + phase * 4);
// Deterministic noise keeps Chromatic snapshots stable.
const noise = (seed: number, count = 60): number[] => Array.from({ length: count }, (_, i) => {
    const value = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453;
    return value - Math.floor(value);
});
const normal = (seed: number, count = 120): number[] => {
    const a = noise(seed, count);
    const b = noise(seed + 100, count);
    return a.map((u, i) => Math.sqrt(-2 * Math.log(u || 0.01)) * Math.cos(2 * Math.PI * b[i]!));
};
const grid = Array.from({ length: 20 }, (_, row) => Array.from({ length: 20 }, (__, col) => Math.sin(row / 3) * Math.cos(col / 4) * 10));
const hierarchy = {
    labels: ['Lab', 'Bench A', 'Bench B', 'DMM', 'Scope', 'PSU', 'Switch'],
    parents: ['', 'Lab', 'Lab', 'Bench A', 'Bench A', 'Bench B', 'Bench B'],
    values: [0, 0, 0, 30, 20, 25, 15]
};
const prices = {
    x: days,
    open: [20, 24, 22, 27, 25],
    high: [26, 28, 27, 31, 29],
    low: [18, 21, 19, 24, 22],
    close: [24, 22, 26, 25, 28]
};
const cube = {
    x: [0, 0, 1, 1, 0, 0, 1, 1],
    y: [0, 1, 0, 1, 0, 1, 0, 1],
    z: [0, 0, 0, 0, 1, 1, 1, 1]
};
const radar = ['Speed', 'Power', 'Accuracy', 'Cost', 'Size'];

export const plotlyExamples: PlotlyExample[] = [
    {
        title: 'Line',
        type: 'scatter (lines)',
        data: [
            { type: 'scatter', mode: 'lines', name: 'Measured', x: xs, y: wave(0) },
            {
                type: 'scatter', mode: 'lines', name: 'Target', x: xs, y: wave(1), line: { dash: 'dash' }
            }
        ]
    },
    {
        title: 'Scatter',
        type: 'scatter (markers)',
        data: [
            { type: 'scatter', mode: 'markers', name: 'A', x: noise(1), y: noise(2) },
            {
                type: 'scatter', mode: 'markers', name: 'B', x: noise(3), y: noise(4), marker: { symbol: 'square' }
            }
        ]
    },
    {
        title: 'Bubble',
        type: 'scatter (marker.size)',
        data: [{ type: 'scatter', mode: 'markers', x: noise(5, 20), y: noise(6, 20), marker: { size: noise(7, 20).map(v => 8 + v * 30) } }]
    },
    {
        title: 'Stacked area',
        type: 'scatter (stackgroup)',
        data: [
            { type: 'scatter', name: 'A', x: xs, y: wave(0), stackgroup: 'one' },
            { type: 'scatter', name: 'B', x: xs, y: wave(2), stackgroup: 'one' }
        ]
    },
    {
        title: 'Error bars',
        type: 'scatter (error_y)',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        data: [{ type: 'scatter', x: days, y: [42, 58, 51, 73, 65], error_y: { type: 'data', array: [4, 6, 3, 8, 5] } }]
    },
    {
        title: 'Bar',
        type: 'bar',
        data: [
            { type: 'bar', name: 'Measured', x: days, y: [42, 58, 51, 73, 65] },
            { type: 'bar', name: 'Target', x: days, y: [48, 52, 56, 60, 64] }
        ]
    },
    {
        title: 'Stacked horizontal bar',
        type: 'bar (orientation: h)',
        data: [
            { type: 'bar', orientation: 'h', name: 'Pass', y: days, x: [30, 40, 35, 50, 45] },
            { type: 'bar', orientation: 'h', name: 'Fail', y: days, x: [5, 8, 3, 6, 4] }
        ],
        layout: { barmode: 'stack' }
    },
    {
        title: 'Histogram',
        type: 'histogram',
        data: [
            { type: 'histogram', name: 'A', x: normal(1), opacity: 0.7 },
            { type: 'histogram', name: 'B', x: normal(2).map(v => v + 1), opacity: 0.7 }
        ],
        layout: { barmode: 'overlay' }
    },
    {
        title: '2D histogram',
        type: 'histogram2d',
        data: [{ type: 'histogram2d', x: normal(3, 400), y: normal(4, 400) }]
    },
    {
        title: '2D density contour',
        type: 'histogram2dcontour',
        data: [{ type: 'histogram2dcontour', x: normal(5, 400), y: normal(6, 400) }]
    },
    {
        title: 'Box',
        type: 'box',
        data: [1, 2, 3].map(i => ({ type: 'box', name: `Station ${i}`, y: normal(i * 10).map(v => v + i) }))
    },
    {
        title: 'Violin',
        type: 'violin',
        data: [1, 2, 3].map(i => ({ type: 'violin', name: `Station ${i}`, y: normal(i * 20).map(v => v + i), box: { visible: true } }))
    },
    {
        title: 'Heatmap',
        type: 'heatmap',
        data: [{ type: 'heatmap', z: grid }]
    },
    {
        title: 'Contour',
        type: 'contour',
        data: [{ type: 'contour', z: grid }]
    },
    {
        title: 'Waterfall',
        type: 'waterfall',
        data: [{
            type: 'waterfall',
            x: ['Start', 'Sales', 'Services', 'Costs', 'Total'],
            y: [60, 80, 20, -50, 0],
            measure: ['absolute', 'relative', 'relative', 'relative', 'total']
        }]
    },
    {
        title: 'Funnel',
        type: 'funnel',
        data: [{ type: 'funnel', y: ['Built', 'Tested', 'Passed', 'Shipped'], x: [120, 95, 80, 72] }]
    },
    {
        title: 'Funnel area',
        type: 'funnelarea',
        data: [{ type: 'funnelarea', text: ['Built', 'Tested', 'Passed', 'Shipped'], values: [120, 95, 80, 72] }]
    },
    {
        title: 'Pie',
        type: 'pie',
        data: [{ type: 'pie', labels: ['Pass', 'Fail', 'Skipped'], values: [72, 18, 10] }]
    },
    {
        title: 'Donut',
        type: 'pie (hole)',
        data: [{ type: 'pie', hole: 0.5, labels: ['CPU', 'Memory', 'Disk', 'Network'], values: [35, 25, 25, 15] }]
    },
    {
        title: 'Sunburst',
        type: 'sunburst',
        data: [{ type: 'sunburst', ...hierarchy }]
    },
    {
        title: 'Treemap',
        type: 'treemap',
        data: [{ type: 'treemap', ...hierarchy }]
    },
    {
        title: 'Icicle',
        type: 'icicle',
        data: [{ type: 'icicle', ...hierarchy }]
    },
    {
        title: 'Sankey',
        type: 'sankey',
        data: [{
            type: 'sankey',
            node: { label: ['Built', 'Tested', 'Rework', 'Shipped', 'Scrapped'] },
            link: { source: [0, 0, 1, 1, 2, 2], target: [1, 2, 3, 2, 3, 4], value: [80, 20, 70, 10, 22, 8] }
        }]
    },
    {
        title: 'Radar',
        type: 'scatterpolar',
        data: [
            { type: 'scatterpolar', name: 'Unit A', r: [4, 3, 5, 2, 4], theta: radar, fill: 'toself' },
            { type: 'scatterpolar', name: 'Unit B', r: [3, 4, 3, 4, 2], theta: radar, fill: 'toself' }
        ]
    },
    {
        title: 'Polar bar',
        type: 'barpolar',
        data: [{ type: 'barpolar', r: [8, 6, 9, 4, 7, 5, 8, 3], theta: [0, 45, 90, 135, 180, 225, 270, 315] }]
    },
    {
        title: 'Ternary',
        type: 'scatterternary',
        data: [{ type: 'scatterternary', mode: 'markers', a: noise(8, 20), b: noise(9, 20), c: noise(10, 20) }]
    },
    {
        title: 'Candlestick',
        type: 'candlestick',
        data: [{ type: 'candlestick', ...prices }],
        layout: { xaxis: { rangeslider: { visible: false } } }
    },
    {
        title: 'OHLC',
        type: 'ohlc',
        data: [{ type: 'ohlc', ...prices }],
        layout: { xaxis: { rangeslider: { visible: false } } }
    },
    {
        title: 'Indicator',
        type: 'indicator',
        data: [{ type: 'indicator', mode: 'gauge+number+delta', value: 72, delta: { reference: 65 }, gauge: { axis: { range: [0, 100] } } }]
    },
    {
        title: 'Table',
        type: 'table',
        data: [{
            type: 'table',
            header: { values: ['Day', 'Measured', 'Target'] },
            cells: { values: [days, [42, 58, 51, 73, 65], [48, 52, 56, 60, 64]] }
        }]
    },
    {
        title: 'Parallel coordinates',
        type: 'parcoords',
        data: [{
            type: 'parcoords',
            dimensions: [
                { label: 'Voltage', values: noise(11, 30) },
                { label: 'Current', values: noise(12, 30) },
                { label: 'Temperature', values: noise(13, 30) }
            ]
        }],
        // Parallel coordinates draw axis labels outside the plot area.
        layout: { margin: { t: 48, r: 40, b: 24, l: 40 } }
    },
    {
        title: 'Parallel categories',
        type: 'parcats',
        data: [{
            type: 'parcats',
            dimensions: [
                { label: 'Bench', values: ['A', 'A', 'B', 'B', 'B', 'C'] },
                { label: 'Result', values: ['Pass', 'Fail', 'Pass', 'Pass', 'Fail', 'Pass'] }
            ]
        }]
    },
    {
        title: 'Scatter matrix',
        type: 'splom',
        data: [{
            type: 'splom',
            dimensions: [
                { label: 'A', values: noise(14, 30) },
                { label: 'B', values: noise(15, 30) },
                { label: 'C', values: noise(16, 30) }
            ]
        }]
    },
    {
        title: 'WebGL scatter',
        type: 'scattergl',
        data: [{ type: 'scattergl', mode: 'markers', x: normal(17, 1000), y: normal(18, 1000), marker: { size: 4 } }]
    },
    {
        title: '3D scatter',
        type: 'scatter3d',
        data: [{
            type: 'scatter3d', mode: 'markers', x: noise(19, 40), y: noise(20, 40), z: noise(21, 40), marker: { size: 3 }
        }]
    },
    {
        title: 'Surface',
        type: 'surface',
        data: [{ type: 'surface', z: grid }]
    },
    {
        title: 'Mesh',
        type: 'mesh3d',
        data: [{ type: 'mesh3d', ...cube, alphahull: 0, opacity: 0.6 }]
    },
    {
        title: 'Isosurface',
        type: 'isosurface',
        data: [{ type: 'isosurface', ...cube, value: [1, 2, 3, 4, 5, 6, 7, 8], isomin: 2, isomax: 7 }]
    },
    {
        title: 'Volume',
        type: 'volume',
        data: [{ type: 'volume', ...cube, value: [1, 2, 3, 4, 5, 6, 7, 8], opacity: 0.2, surface: { count: 5 } }]
    }
];

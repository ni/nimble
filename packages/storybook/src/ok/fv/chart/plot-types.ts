import {
    areaX, areaY, arrow, bandX, bandY, barX, barY, binX, boxX, boxY,
    cell, differenceX, differenceY, dot, frame, hexagon, lineX, lineY,
    linearRegressionX, linearRegressionY, link, rect, ridgelineX, ridgelineY,
    ruleX, ruleY, stack, text, tickX, tickY, vector, violinX, violinY,
    waffleX, waffleY, waterfall,
    type ChartHostOptions, type StaticChartDefinition
} from '@tanstack/charts';
import {
    angleGrid, pie, polar, radialArc, radialArea, radialBarAngle, radialBarRadius,
    radialDot, radialGrid, radialLine, radialRule, radialText
} from '@tanstack/charts/polar';
import { geoShape } from '@tanstack/charts/geo';
import { treeLayout } from '@tanstack/charts/hierarchy/tree';
import { treemap } from '@tanstack/charts/hierarchy/treemap';
import { sunburst } from '@tanstack/charts/hierarchy/sunburst';
import { forceLayout } from '@tanstack/charts/network/force';
import { sankeyDiagram } from '@tanstack/charts/network/sankey';
import { contour } from '@tanstack/charts/spatial/contour';
import { densityContour } from '@tanstack/charts/spatial/density';
import { hexbin } from '@tanstack/charts/spatial/hexbin';
import { voronoi } from '@tanstack/charts/spatial/voronoi';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scaleUtc } from '@tanstack/charts/scales/time';
import { tooltip } from '@tanstack/charts/tooltip';
import { geoIdentity } from 'd3-geo';
import {
    applicationBackgroundColor,
    graphTrace1Color,
    graphTrace2Color
} from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

const series = [
    { day: 'Mon', x: 1, value: 42, target: 48 },
    { day: 'Tue', x: 2, value: 58, target: 52 },
    { day: 'Wed', x: 3, value: 51, target: 56 },
    { day: 'Thu', x: 4, value: 73, target: 60 },
    { day: 'Fri', x: 5, value: 65, target: 64 }
];
const stackedSeries = series.flatMap(row => [
    { ...row, group: 'Measured', amount: row.value },
    { ...row, group: 'Target', amount: row.target }
]);
const arcs = pie(series, { value: 'value', gapAngle: 0.03 });
const observations = Array.from({ length: 90 }, (_, i) => ({
    station: ['A', 'B', 'C'][i % 3]!,
    x: 20 + (i % 3) * 15 + Math.sin(i * 1.7) * (8 + (i % 7)),
    y: 30 + (i % 3) * 10 + Math.cos(i * 2.3) * (6 + (i % 9))
}));
const profiles = ['A', 'B', 'C'].flatMap((station, i) => Array.from({ length: 17 }, (_, j) => ({
    station,
    position: j,
    width: Math.exp(-((j - 6 - i * 2) ** 2) / 12)
})));
const links = series.slice(0, -1).map((row, i) => ({
    x1: row.x, y1: row.value, x2: row.x + 1, y2: series[i + 1]!.value
}));
const heatmap = ['A', 'B', 'C'].flatMap((station, i) => series.map(row => ({
    station, day: row.day, status: ['Low', 'Medium', 'High'][(row.x + i) % 3]!
})));
const hierarchy = [
    { path: 'System/Acquisition/Voltage', value: 30 },
    { path: 'System/Acquisition/Current', value: 20 },
    { path: 'System/Analysis/Spectral', value: 25 },
    { path: 'System/Analysis/Statistics', value: 15 },
    { path: 'System/Reporting', value: 10 }
];
const tree = treeLayout(hierarchy, { path: 'path', delimiter: '/' });
const graphNodes = ['Acquire', 'Analyze', 'Report', 'Archive'].map(id => ({ id }));
const graphLinks = [
    { source: 'Acquire', target: 'Analyze', value: 8 },
    { source: 'Analyze', target: 'Report', value: 5 },
    { source: 'Analyze', target: 'Archive', value: 3 }
];
const network = forceLayout(graphNodes, graphLinks, {
    nodeKey: 'id',
    source: 'source',
    target: 'target',
    forces: [{ type: 'link' }, { type: 'manyBody', strength: -150 }, { type: 'center' }]
});
const numeric = { x: { scale: scaleLinear }, y: { scale: scaleLinear, grid: true } };
const vertical = { x: { scale: () => scaleBand().padding(0.25) }, y: { scale: scaleLinear, grid: true } };
const horizontal = { x: { scale: scaleLinear, grid: true }, y: { scale: () => scaleBand().padding(0.25) } };
const noAxes = { x: null, y: null };
const polarScales = { angle: { scale: scaleBand }, radius: { scale: scaleLinear().domain([0, 80]) } };
const numericPolarScales = {
    angle: { scale: scaleLinear().domain([1, 6]) },
    radius: { scale: scaleLinear().domain([0, 80]) }
};
const differenceColors = {
    positiveFill: `var(${graphTrace1Color.cssCustomProperty})`,
    negativeFill: `var(${graphTrace2Color.cssCustomProperty})`,
    stroke: `var(${graphTrace1Color.cssCustomProperty})`,
    comparisonStroke: `var(${graphTrace2Color.cssCustomProperty})`
};

interface PlotExample {
    title: string;
    api: string;
    options: ChartHostOptions;
}

function plot(
    title: string,
    api: string,
    marks: StaticChartDefinition['marks'],
    scales: StaticChartDefinition['scales'] = numeric
): PlotExample {
    return {
        title,
        api,
        options: { ariaLabel: title, height: 240, definition: { marks, scales, tooltip } }
    };
}

export const plotExamples: PlotExample[] = [
    plot('Line', 'lineY', [lineY(series, { x: 'x', y: 'value', points: true })]),
    plot('Horizontal line', 'lineX', [lineX(series, { x: 'value', y: 'x', points: true })]),
    plot('Time series', 'lineY + scaleUtc', [
        lineY(series.map(row => ({ ...row, date: new Date(Date.UTC(2026, 0, row.x)) })), { x: 'date', y: 'value' })
    ], { x: { scale: scaleUtc }, y: { scale: scaleLinear, grid: true } }),
    plot('Vertical bars', 'barY', [barY(series, { x: 'day', y: 'value' })], vertical),
    plot('Horizontal bars', 'barX', [barX(series, { x: 'value', y: 'day' })], horizontal),
    plot('Area', 'areaY', [areaY(series, { x: 'x', y: 'value', fillOpacity: 0.25 }), lineY(series, { x: 'x', y: 'value' })]),
    plot('Horizontal area', 'areaX', [areaX(series, { x: 'value', y: 'x', fillOpacity: 0.25 })]),
    plot('Stacked bars', 'stack + barY', [
        barY(stackedSeries, { x: 'day', y: 'amount', color: 'group', layout: stack() })
    ], vertical),
    plot('Stacked area', 'stack + areaY', [
        areaY(stackedSeries, { x: 'x', y: 'amount', color: 'group', layout: stack(), fillOpacity: 0.6 })
    ]),
    plot('Scatter', 'dot', [dot(observations, { x: 'x', y: 'y', color: 'station', r: 3 })]),
    plot('Bubble', 'dot + r', [dot(series, { x: 'x', y: 'value', r: row => row.value / 5, fillOpacity: 0.5 })]),
    plot('Histogram', 'binX + rect', [
        rect(binX(observations, { value: 'x', thresholds: 12 }), { x1: 'x1', x2: 'x2', y1: () => 0, y2: 'value', inset: 1 })
    ]),
    plot('Vertical box plot', 'boxY', [boxY(observations, { x: 'station', y: 'y', fillOpacity: 0.25 })], vertical),
    plot('Horizontal box plot', 'boxX', [boxX(observations, { x: 'x', y: 'station', fillOpacity: 0.25 })], horizontal),
    plot('Vertical violin', 'violinY', [
        violinY(profiles, { x: 'station', y: 'position', width: 'width', color: 'station', fillOpacity: 0.4 })
    ], vertical),
    plot('Horizontal violin', 'violinX', [
        violinX(profiles, { x: 'position', y: 'station', width: 'width', color: 'station', fillOpacity: 0.4 })
    ], horizontal),
    plot('Ridgeline', 'ridgelineY', [
        ridgelineY(profiles, { x: 'position', y: 'station', height: 'width', color: 'station', fillOpacity: 0.5 })
    ], horizontal),
    plot('Vertical ridgeline', 'ridgelineX', [
        ridgelineX(profiles, { x: 'station', y: 'position', height: 'width', color: 'station', fillOpacity: 0.5 })
    ], vertical),
    plot('Difference', 'differenceY', [differenceY(series, { x: 'x', y1: 'target', y2: 'value', ...differenceColors })]),
    plot('Horizontal difference', 'differenceX', [differenceX(series, { y: 'x', x1: 'target', x2: 'value', ...differenceColors })]),
    plot('Vertical regression', 'linearRegressionY', [
        dot(observations, { x: 'x', y: 'y', r: 2, fillOpacity: 0.4 }),
        linearRegressionY(observations, { x: 'x', y: 'y' })
    ]),
    plot('Horizontal regression', 'linearRegressionX', [
        dot(observations, { x: 'x', y: 'y', r: 2, fillOpacity: 0.4 }),
        linearRegressionX(observations, { x: 'x', y: 'y' })
    ]),
    plot('Waterfall', 'waterfall + rect', [
        rect(waterfall([{ step: 'Start', value: 40 }, { step: 'Added', value: 25 }, { step: 'Removed', value: -15 }], {
            value: 'value'
        }), { x: row => row.source[0]!.step, y1: 'start', y2: 'end', color: 'kind' })
    ], vertical),
    plot('Heatmap', 'cell', [cell(heatmap, { x: 'day', y: 'station', color: 'status', inset: 2 })], {
        x: { scale: scaleBand }, y: { scale: scaleBand }
    }),
    plot('Intervals', 'rect', [
        rect(series, { x1: row => row.x - 0.35, x2: row => row.x + 0.35, y1: 'target', y2: 'value' })
    ]),
    plot('Vertical bands', 'bandX', [
        bandX(series.filter(row => row.x % 2), { x: 'day', fillOpacity: 0.1 }),
        lineY(series, { x: 'day', y: 'value' })
    ], vertical),
    plot('Horizontal bands', 'bandY', [
        bandY(series.filter(row => row.x % 2), { y: 'day', fillOpacity: 0.1 }),
        dot(series, { x: 'value', y: 'day' })
    ], horizontal),
    plot('Vertical rules', 'ruleX', [ruleX([2, 4]), lineY(series, { x: 'x', y: 'value' })]),
    plot('Horizontal rules', 'ruleY', [ruleY([50, 65]), lineY(series, { x: 'x', y: 'value' })]),
    plot('Vertical ticks / rug', 'tickX', [tickX(observations, { x: 'x', y: 'station' })], horizontal),
    plot('Horizontal ticks / rug', 'tickY', [tickY(observations, { x: 'station', y: 'y' })], vertical),
    plot('Links', 'link', [link(links, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2' })]),
    plot('Arrows', 'arrow', [arrow(links, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2' })]),
    plot('Vector field', 'vector', [vector(observations, { x: 'x', y: 'y', length: 12, rotate: row => row.x * 5 })]),
    plot('Hexagons', 'hexagon', [hexagon(observations, { x: 'x', y: 'y', r: 5, color: 'station' })]),
    plot('Text annotations', 'text', [
        dot(series, { x: 'x', y: 'value' }),
        text(series, { x: 'x', y: 'value', text: 'day', dy: -12 })
    ]),
    plot('Frame', 'frame', [frame(), dot(observations, { x: 'x', y: 'y', r: 2 })]),
    plot('Waffle', 'waffleY', [waffleY(series, { y: 'value', color: 'day', unit: 5, columns: 12 })], noAxes),
    plot('Horizontal waffle', 'waffleX', [waffleX(series, { x: 'value', color: 'day', unit: 5, rows: 8 })], noAxes),
    plot('Pie', 'polar + radialArc', [polar({
        marks: [radialArc(arcs, {
            startAngle: 'startAngle', endAngle: 'endAngle', color: 'day'
        })],
        scales: { angle: null, radius: null }
    })], noAxes),
    plot('Donut', 'polar + radialArc', [polar({
        marks: [radialArc(arcs, {
            startAngle: 'startAngle', endAngle: 'endAngle', innerRadius: context => context.radius * 0.55, color: 'day'
        })],
        scales: { angle: null, radius: null }
    })], noAxes),
    plot('Radial bars', 'radialBarRadius', [polar({
        marks: [radialBarRadius(series, { angle: 'day', radius: 'value', color: 'day' })],
        scales: polarScales,
        guides: [radialGrid()]
    })], noAxes),
    plot('Radial progress bars', 'radialBarAngle', [polar({
        marks: [radialBarAngle(series, { angle: 'value', radius: 'day', color: 'day' })],
        scales: { angle: { scale: scaleLinear().domain([0, 100]) }, radius: { scale: scaleBand } },
        endAngle: Math.PI * 1.75
    })], noAxes),
    plot('Radar line', 'radialLine', [polar({
        inset: 24,
        marks: [radialLine([...series, series[0]!], { angle: 'day', radius: 'value' })],
        scales: polarScales,
        guides: [radialGrid(), angleGrid()]
    })], noAxes),
    plot('Radar area', 'radialArea', [polar({
        inset: 24,
        marks: [radialArea([...series, series[0]!], { angle: 'day', radius: 'value', fillOpacity: 0.25 })],
        scales: polarScales,
        guides: [radialGrid(), angleGrid()]
    })], noAxes),
    plot('Polar scatter', 'radialDot', [polar({
        inset: 24,
        marks: [radialDot(series, { angle: 'x', radius: 'value', color: 'day', r: 5 })],
        scales: numericPolarScales,
        guides: [radialGrid(), angleGrid({ values: [1, 2, 3, 4, 5] })]
    })], noAxes),
    plot('Radial rules and labels', 'radialRule + radialText', [polar({
        inset: 24,
        marks: [
            radialRule(series, { angle: 'day', radius2: 'value' }),
            radialText(series, { angle: 'day', radius: 'value', text: 'day', radiusOffset: 12 })
        ],
        scales: polarScales,
        guides: [radialGrid()]
    })], noAxes),
    plot('Treemap', 'treemap', [treemap(hierarchy, {
        path: 'path',
        delimiter: '/',
        value: 'value',
        color: 'name',
        paddingInner: 3,
        label: 'name',
        labelFill: `var(${applicationBackgroundColor.cssCustomProperty})`,
        labelFontSize: 13
    })], noAxes),
    plot('Sunburst', 'polar + sunburst', [polar({
        marks: [sunburst(hierarchy, { path: 'path', delimiter: '/', value: 'value', color: 'branchId', ringPadding: 3 })],
        scales: { angle: null, radius: null }
    })], noAxes),
    plot('Tree', 'treeLayout + link + dot', [
        link(tree.links, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2' }),
        dot(tree.nodes, { x: 'x', y: 'y', r: 5 }),
        text(tree.nodes, { x: 'x', y: 'y', text: 'name', dy: -12 })
    ], { x: { scale: scaleLinear, axis: false }, y: { scale: scaleLinear, axis: false } }),
    plot('Force network', 'forceLayout + link + dot', [
        link(network.links, { x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2' }),
        dot(network.nodes, { x: 'x', y: 'y', color: 'id', r: 8 }),
        text(network.nodes, { x: 'x', y: 'y', text: 'id', dy: -15 })
    ], { x: { scale: scaleLinear, axis: false }, y: { scale: scaleLinear, axis: false } }),
    plot('Sankey flow', 'sankeyDiagram', [sankeyDiagram({
        nodes: graphNodes,
        links: graphLinks,
        nodeKey: 'id',
        source: 'source',
        target: 'target',
        value: 'value',
        marks: ({ nodes, links: flowLinks }) => [
            link(flowLinks, {
                x1: 'x1', y1: 'y1', x2: 'x2', y2: 'y2', strokeWidth: row => row.width, strokeOpacity: 0.3
            }),
            rect(nodes, { x1: 'x0', x2: 'x1', y1: 'y0', y2: 'y1', color: 'key' })
        ]
    })], noAxes),
    plot('Density contours', 'densityContour', [
        densityContour(observations, { x: 'x', y: 'y', bandwidth: 18, fillOpacity: 0.3 }),
        dot(observations, { x: 'x', y: 'y', r: 1.5 })
    ]),
    plot('Scalar contours', 'contour', [contour(Array.from({ length: 400 }, (_, i) => (
        Math.sin((i % 20) / 4) * Math.cos(Math.floor(i / 20) / 4)
    )), { width: 20, height: 20, thresholds: 8, color: 'value' })], noAxes),
    plot('Hexbin', 'hexbin', [hexbin(observations, {
        x: 'x', y: 'y', binWidth: 24, color: 'count'
    })]),
    plot('Voronoi', 'voronoi', [
        voronoi(observations.slice(0, 20), { x: 'x', y: 'y', fillOpacity: 0.15 }),
        dot(observations.slice(0, 20), { x: 'x', y: 'y', r: 3 })
    ]),
    plot('Geographic shapes', 'geoShape', [geoShape([
        { type: 'Polygon', coordinates: [[[0, 0], [80, 5], [65, 65], [5, 50], [0, 0]]] },
        { type: 'Polygon', coordinates: [[[85, 5], [150, 15], [145, 75], [70, 65], [85, 5]]] },
        { type: 'Polygon', coordinates: [[[10, 55], [65, 70], [90, 110], [0, 100], [10, 55]]] }
    ], { projection: { type: geoIdentity, fit: 'data', inset: 10 }, color: (_, context) => context.index })], noAxes)
];

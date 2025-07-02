import type { Meta, StoryObj } from '@storybook/html';
import { html, ref } from '@ni/fast-element';
import { FastGraph, fastGraphTag } from '@ni/spright-components/dist/esm/fast-graph';
import { AxisAutoScale, AxisType, type PlotStyle } from '@ni/spright-components/dist/esm/fast-graph/types';
import {
    apiCategory,
    createUserSelectedThemeStory
} from '../../utilities/storybook';

type WindowWithTimeout = Window & {
    timeout?: NodeJS.Timeout | number
};

interface BaseGraphArgs {
    fastGraphRef: FastGraph;
    updateData: (args: BaseGraphArgs) => void;
    continuous: boolean;
    timeoutId?: unknown;
}

const metadata: Meta<BaseGraphArgs> = {
    title: 'Spright/FastGraph'
};

export default metadata;

interface FastGraphArgs extends BaseGraphArgs {
    plotStyle: PlotStyle;
    plotCount: number;
    samplesPerPlot: number;
}

interface AxisConfigArgs extends BaseGraphArgs {
    yAxisAutoScale: AxisAutoScale;
    xAxisAutoScale: AxisAutoScale;
    xAxisType: AxisType;
    yAxisType: AxisType;
    xAxisLabel: string;
    yAxisLabel: string;
}

interface PlotStyleArgs extends BaseGraphArgs {
    showLines: boolean;
    showPoints: boolean;
    showBars: boolean;
    lineWidth: number;
    pointRadius: number;
    barWidth: number;
    lineColor: string;
    lineFill: boolean;
    pointColor: string;
    pointFill: boolean;
    barColor: string;
    steps: boolean;
    symbol: string; // e.g., 'circle', 'square', 'diamond'
}

export const fastGraph: StoryObj<FastGraphArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="width: 800px; height: 500px;">
            <${fastGraphTag} 
                ${ref('fastGraphRef')}
                 data-unused="${x => x.updateData(x)}"
            ></${fastGraphTag}>
        </div>
    `),
    beforeEach: _ => {
        if ((window as WindowWithTimeout).timeout) {
            clearInterval((window as WindowWithTimeout).timeout);
        }
        (window as WindowWithTimeout).timeout = undefined;
    },
    argTypes: {
        fastGraphRef: { table: { disable: true } },
        updateData: { table: { disable: true } },
        plotCount: { control: { type: 'number' } },
        samplesPerPlot: { control: { type: 'number' } },
        continuous: { control: { type: 'boolean' } },
    },
    args: {
        plotCount: 10,
        samplesPerPlot: 100,
        continuous: true,
        fastGraphRef: undefined,
        updateData: x => {
            window.requestAnimationFrame(() => {
                const args = x as FastGraphArgs;
                if ((window as WindowWithTimeout).timeout) {
                    clearInterval((window as WindowWithTimeout).timeout);
                }
                const updateGraph = (): void => {
                    const data = [];
                    for (let i = 0; i < args.plotCount; i++) {
                        const plotData = [];
                        for (let j = 0; j < args.samplesPerPlot; j++) {
                            plotData.push(Math.random() * 2 + i * 2);
                        }
                        data.push(plotData);
                    }
                    args.fastGraphRef.setData(data);
                };

                if (args.continuous) {
                    // Auto update every 30 milliseconds
                    (window as WindowWithTimeout).timeout = setInterval(updateGraph, 30);
                } else {
                    updateGraph();
                }
            });
        }
    }
};

export const axisConfiguration: StoryObj<AxisConfigArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="width: 800px; height: 500px;">
            <${fastGraphTag} 
                ${ref('fastGraphRef')}
                 data-unused="${x => x.updateData(x)}"
            ></${fastGraphTag}>
        </div>
    `),
    beforeEach: _ => {
        if ((window as WindowWithTimeout).timeout) {
            clearInterval((window as WindowWithTimeout).timeout);
        }
        (window as WindowWithTimeout).timeout = undefined;
    },
    argTypes: {
        fastGraphRef: { table: { disable: true } },
        updateData: { table: { disable: true } },
        yAxisAutoScale: {
            options: Object.keys(AxisAutoScale),
            control: { type: 'radio' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        xAxisAutoScale: {
            options: Object.keys(AxisAutoScale),
            control: { type: 'radio' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        yAxisType: {
            options: Object.keys(AxisType),
            control: { type: 'radio' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        xAxisType: {
            options: Object.keys(AxisType),
            control: { type: 'radio' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        yAxisLabel: {
            control: { type: 'text' },
            table: { category: apiCategory.nonAttributeProperties }
        },
        xAxisLabel: {
            control: { type: 'text' },
            table: { category: apiCategory.nonAttributeProperties }
        }
    },
    args: {
        yAxisAutoScale: AxisAutoScale.loose,
        xAxisAutoScale: AxisAutoScale.exact,
        yAxisType: AxisType.linear,
        xAxisType: AxisType.linear,
        yAxisLabel: 'Y Axis',
        xAxisLabel: 'X Axis',
        fastGraphRef: undefined,
        updateData: x => {
            window.requestAnimationFrame(() => {
                if ((window as WindowWithTimeout).timeout) {
                    clearInterval((window as WindowWithTimeout).timeout);
                }
                const args = x as AxisConfigArgs;
                let index = 0;
                args.fastGraphRef.flotConfig = {
                    yaxes: [{
                        autoScale: args.yAxisAutoScale,
                        mode: args.yAxisType,
                        min: 0,
                        max: 10,
                        axisLabel: args.yAxisLabel
                    }],
                    xaxes: [{
                        autoScale: args.xAxisAutoScale,
                        mode: args.xAxisType,
                        min: 0,
                        max: 10,
                        axisLabel: args.xAxisLabel
                    }]
                };
                const updateGraph = (): void => {
                    const start = index;
                    const end = start + 2;
                    const data = [];
                    for (let i = 0; i <= 40; ++i) {
                        const value = start + i / 40 * (end - start);
                        data.push([value, Math.cos(value)]);
                    }
                    args.fastGraphRef.setData([data]);
                    index += 0.01;
                };
                // Auto update every 30 milliseconds
                (window as WindowWithTimeout).timeout = setInterval(updateGraph, 30);
            });
        }
    }
};

export const plotStyleConfiguration: StoryObj<PlotStyleArgs> = {
    render: createUserSelectedThemeStory(html`
        <div style="width: 800px; height: 500px;">
            <${fastGraphTag} 
                ${ref('fastGraphRef')}
                 data-unused="${x => x.updateData(x)}"
            ></${fastGraphTag}>
        </div>
    `),
    beforeEach: _ => {
        if ((window as WindowWithTimeout).timeout) {
            clearInterval((window as WindowWithTimeout).timeout);
        }
        (window as WindowWithTimeout).timeout = undefined;
    },
    argTypes: {
        fastGraphRef: { table: { disable: true } },
        updateData: { table: { disable: true } },
        showLines: { control: { type: 'boolean' } },
        lineFill: { control: { type: 'boolean' } },
        pointFill: { control: { type: 'boolean' } },
        showPoints: { control: { type: 'boolean' } },
        showBars: { control: { type: 'boolean' } },
        lineWidth: { control: { type: 'number' } },
        pointRadius: { control: { type: 'number' } },
        barWidth: { control: { type: 'number' } },
        lineColor: { control: { type: 'color' } },
        pointColor: { control: { type: 'color' } },
        barColor: { control: { type: 'color' } },
        steps: { control: { type: 'boolean' } },
        symbol: {
            options: ['circle', 'square', 'diamond'],
            control: { type: 'radio' },
        }
    },
    args: {
        showLines: true,
        showPoints: true,
        showBars: false,
        lineWidth: 2,
        lineFill: false,
        pointFill: true,
        pointRadius: 5,
        barWidth: 1,
        lineColor: '#FF0000',
        pointColor: '#00FF00',
        barColor: '#0000FF',
        steps: false,
        symbol: 'circle',
        fastGraphRef: undefined,
        updateData(x) {
            window.requestAnimationFrame(() => {
                const args = x as PlotStyleArgs;
                args.fastGraphRef.flotConfig.plots = [{
                    color: args.lineColor,
                    lines:
                        args.showLines ? {
                            lineWidth:
                                args.lineWidth,
                            fill: args.lineFill,
                            steps: args.steps,
                            show: true,
                            fillColor: args.lineColor
                        } : { show: false },
                    points:
                        args.showPoints ? {
                            radius:
                                args.pointRadius,
                            symbol: args.symbol,
                            fill: args.pointFill,
                            show: true,
                            fillColor: args.pointColor
                        } : { show: false },
                    bars:
                        args.showBars ? {
                            barWidth:
                                args.barWidth,
                            show: true,
                            fillColor: args.barColor
                        } : { show: false }
                }];
                const data = [];
                for (let i = 0; i < 10; i++) {
                    data.push([i, Math.sin(i)]);
                }
                args.fastGraphRef.setData([data]);
            });
        }
    }
};

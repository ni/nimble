import type { Meta, StoryObj } from '@storybook/html';
import { html, ref } from '@ni/fast-element';
import { FastGraph, fastGraphTag } from '@ni/spright-components/dist/esm/fast-graph';
import type { AxisAutoScale, AxisType, PlotStyle } from '@ni/spright-components/dist/esm/fast-graph/types';
import {
    createUserSelectedThemeStory
} from '../../utilities/storybook';

interface FastGraphArgs {
    fastGraphRef: FastGraph;
    updateData: (args: FastGraphArgs) => void;
    yAxisAutoScale: AxisAutoScale;
    xAxisAutoScale: AxisAutoScale;
    xAxisType: AxisType;
    yAxisType: AxisType;
    updateMode: 'manual' | 'auto';
    plotStyle: PlotStyle;
    plotCount: number;
    samplesPerPlot: number;
}

const metadata: Meta<FastGraphArgs> = {
    title: 'Spright/Fast Graph',
    parameters: {
        actions: {}
    },
    render: createUserSelectedThemeStory(html`
        <div style="width: 800px; height: 500px;">
            <${fastGraphTag} 
                ${ref('fastGraphRef')}
                 data-unused="${x => x.updateData(x)}"
            ></${fastGraphTag}>
        </div>
    `),
    argTypes: {
        fastGraphRef: { table: { disable: true } },
        updateData: { table: { disable: true } },
        plotCount: { control: { type: 'number' } },
        samplesPerPlot: { control: { type: 'number' } },
        updateMode: { control: { type: 'boolean' }, options: ['manual', 'auto'] },
    },
    args: {
        plotCount: 10,
        samplesPerPlot: 100,
        updateMode: 'manual',
        fastGraphRef: undefined,
        updateData: x => {
            window.requestAnimationFrame(() => {
                const updateGraph = (): void => {
                    const args = x;
                    const data = [];
                    for (let i = 0; i < args.plotCount; i++) {
                        const plotData = [];
                        for (let j = 0; j < args.samplesPerPlot; j++) {
                            plotData.push(Math.random() * 2 + i * 2);
                        }
                        data.push({ data: plotData, flatdata: true });
                    }
                    args.fastGraphRef.setData(data);
                };

                if (x.updateMode) {
                    updateGraph();
                } else {
                    // Auto update every 30 milliseconds
                    setInterval(updateGraph, 30);
                }
            });
        }
    }
};

export default metadata;

export const fastGraph: StoryObj<FastGraphArgs> = {};

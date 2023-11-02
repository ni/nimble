import {
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import * as echarts from 'echarts';
import { styles } from './styles';
import { template } from './template';
import type { GraphScatterData } from './types';
import { bodyFontColor, graphGridlineColor } from '../theme-provider/design-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-graph': Graph;
    }
}

/**
 * A nimble-styled graph
 */
export class Graph extends FoundationElement {
    public readonly graphContainer!: HTMLElement;

    private eChartsRef?: echarts.ECharts;

    public constructor() {
        super();
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.eChartsRef = echarts.init(this.graphContainer);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.eChartsRef?.dispose();
    }

    public setData(data: GraphScatterData[]): void {
        const seriesData: echarts.SeriesOption[] = [];
        data.forEach(series => {
            const plotData = [];
            for (let i = 0; i < series.x.length; i++) {
                const dataPoint = [series.x[i]!, series.y[i]!];
                plotData.push(dataPoint);
            }
            seriesData.push({ data: plotData, type: 'scatter' });
        });

        const options: echarts.EChartsOption = {
            series: seriesData,
            xAxis: {
                axisLine: {
                    lineStyle: {
                        color: bodyFontColor.getValueFor(this)
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: graphGridlineColor.getValueFor(this)
                    }
                }
            },
            yAxis: {
                axisLine: {
                    lineStyle: {
                        color: bodyFontColor.getValueFor(this)
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: graphGridlineColor.getValueFor(this)
                    }
                }
            }
        };
        this.eChartsRef?.setOption(options);
    }
}

const nimbleGraph = Graph.compose({
    baseName: 'graph',
    baseClass: FoundationElement,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleGraph());
export const graphTag = DesignSystem.tagFor(Graph);

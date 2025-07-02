/* eslint-disable import/extensions */
/* eslint-disable import/no-extraneous-dependencies */
import { observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import 'flot/source/jquery';
import 'flot/lib/jquery.event.drag.js';
import 'flot/lib/jquery.mousewheel.js';
import 'flot/source/jquery.canvaswrapper.js';
import 'flot/source/jquery.colorhelpers.js';
import 'flot/source/jquery.flot.js';
import 'flot/source/jquery.flot.saturated.js';
import 'flot/source/jquery.flot.browser.js';
import 'flot/source/jquery.flot.drawSeries.js';
import 'flot/source/jquery.flot.uiConstants.js';
import 'flot/source/jquery.flot.logaxis.js';
import 'flot/source/jquery.flot.symbol.js';
import 'flot/source/jquery.flot.flatdata.js';
import 'flot/source/jquery.flot.navigate.js';
import 'flot/source/jquery.flot.fillbetween.js';
import 'flot/source/jquery.flot.stack.js';
import 'flot/source/jquery.flot.touchNavigate.js';
import 'flot/source/jquery.flot.hover.js';
import 'flot/source/jquery.flot.touch.js';
import 'flot/source/jquery.flot.time.js';
import 'flot/source/jquery.flot.axislabels.js';
import 'flot/source/jquery.flot.selection.js';
import { styles } from './styles';
import { template } from './template';
import type { AxisConfig, PlotStyle } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-fast-graph': FastGraph;
    }
}

interface Flot {
    setData: (data: unknown) => void;
    setupGrid: (show: boolean) => void;
    draw: () => void;
    clearTextCache: () => void;
    resize: () => void;
    getXAxes: () => AxisConfig[];
    getYAxes: () => AxisConfig[];
}

interface FlotConfig {
    yaxes: AxisConfig[];
    xaxes: AxisConfig[];
    zoom?: { interactive: boolean };
    pan?: { interactive: boolean };
    plots?: PlotStyle[];
    colors?: string[]; // Optional colors for the plots
}

interface FlotFactory {
    plot(placeholder: HTMLElement, data: unknown[], config: FlotConfig): Flot;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
const $ = ((window as any).$ || (window as any).jQuery) as FlotFactory;

/**
 * A Spright demo component (not for production use)
 */
export class FastGraph extends FoundationElement {
    @observable
    public flotElement!: HTMLElement;

    private flot!: Flot;
    private resizeObserver?: ResizeObserver;
    private data: unknown[] = [];
    private config: FlotConfig = {
        yaxes: [{ autoScale: 'loose', mode: 'linear', min: 0, max: 10 }],
        xaxes: [{ autoScale: 'exact', mode: 'linear', min: 0, max: 10 }],
        zoom: { interactive: true },
        pan: { interactive: true },
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        this.flot = $.plot(this.flotElement, this.data, this.config);
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
    }

    public setData(data: unknown): void {
        // Assuming `data` is in a format that Flot can understand
        this.data = data as unknown[];
        this.updateFlot();
    }

    public get flotConfig(): FlotConfig {
        return this.config;
    }

    public set flotConfig(config: FlotConfig) {
        this.config = config;
        const flotData = this.processData();

        this.flot = $.plot(this.flotElement, flotData, this.config);
    }

    private processData(): unknown[] {
        const flotData: unknown[] = [];
        this.data.forEach((plotData, index) => {
            const flatData = !Array.isArray((plotData as unknown[])[0]);
            const plotConfig = this.flotConfig.plots?.[index] ?? {};
            flotData.push({ data: plotData, ...plotConfig, flatdata: flatData });
        });
        return flotData;
    }

    private readonly onResize = (): void => {
        this.flot.clearTextCache();
        this.flot.resize();
        this.updateFlot();
    };

    private readonly updateFlot = (): void => {
        this.flot.setData(this.processData());
        this.flot.setupGrid(true);
        this.flot.draw();
    };
}

const sprightFastGraph = FastGraph.compose({
    baseName: 'fast-graph',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightFastGraph());
export const fastGraphTag = 'spright-fast-graph';

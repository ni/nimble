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
import type { AxisAutoScale } from './types';

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
}

interface FlotConfig {
    yaxis: { min?: number, max?: number, autoScale: AxisAutoScale, color?: string };
    xaxis: { autoScale: AxisAutoScale, color?: string };
    zoom: { interactive: boolean };
    pan: { interactive: boolean };
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
    private data: unknown[] = [{ data: [], flatdata: true }];

    public override connectedCallback(): void {
        super.connectedCallback();
        this.flot = $.plot(this.flotElement, [], { yaxis: { autoScale: 'loose' }, xaxis: { autoScale: 'exact' }, zoom: { interactive: true }, pan: { interactive: true } });
        this.flot.setData(this.data);
        this.flot.setupGrid(true);
        this.flot.draw();
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
    }

    public setData(data: unknown): void {
        // Assuming `data` is in a format that Flot can understand
        // This is a placeholder for actual Flot initialization code
        // Example: $.plot(this.flotElement, data);
        this.data = data as unknown[];
        this.updateFlot();
    }

    private readonly onResize = (): void => {
        this.flot.clearTextCache();
        this.flot.resize();
        this.updateFlot();
    };

    private readonly updateFlot = (): void => {
        this.flot.setData(this.data);
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

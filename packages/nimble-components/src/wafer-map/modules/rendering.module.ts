import { FASTElement } from '@microsoft/fast-element';

import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import { dataGridCellTemplate } from '@microsoft/fast-foundation';
import {
    scaleBand,
    ScaleBand,
    ScaleLinear,
    scaleLinear,
    ScaleOrdinal,
    scaleOrdinal,
    select,
    Selection,
    zoom,
    ZoomBehavior,
    zoomIdentity,
    zoomTransform,
    ZoomTransform
} from 'd3';

import type { Data } from './data.module';

// eslint-disable-next-line jsdoc/require-description
/**
 *
 */
export class RenderingModule {
    public canvasContext!: CanvasRenderingContext2D;
    private readonly data;
    private readonly waferContainer;
    private width: number;
    private height: number;
    private canvasWidth: number;
    private canvasHeight: number;
    private rootSVG: Selection<SVGSVGElement, unknown, null, number>;
    private waferArea: Selection<HTMLDivElement, unknown, null, undefined>;
    private highlightLayer: Selection<SVGSVGElement, unknown, null, undefined>;
    private zoomContainer: Selection<SVGGElement, unknown, null, unknown>;
    private svg: Selection<SVGGElement, unknown, null, unknown>;
    private emptyCanvasDataUrl: string;
    private mainCanvasNode: HTMLCanvasElement;

    public constructor(waferContainer: ElementRef<HTMLElement>, renderingData: Data) {
        this.data = renderingData;
        this.waferContainer = waferContainer;
    }

    private drawCanvas(): void {
        const element = this.waferContainer.nativeElement;
        this.setContainerClass(element);
        this.setContainerSize(element);
        this.width = this.canvasWidth - this.data.margin.left - this.data.margin.right;
        this.height = this.canvasHeight - this.data.margin.top - this.data.margin.bottom;

        if (!this.rootSVG) {
            this.rootSVG = select(element)
                .append('svg')
                .attr('width', this.canvasWidth)
                .attr('height', this.canvasHeight);
        } else {
            this.rootSVG.html(null);
        }
        this.zoomContainer = this.rootSVG.append('g')
            .attr('class', 'zoomContainer');

        this.svg = this.zoomContainer.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

        if (select(element).select('canvas').empty()) {
            this.waferArea = select(element)
                .append('div')
                .classed('waferMapArea', true)
                .style('left', 0)
                .style('top', 0);

            const canvas = this.createCanvasElement(this.waferArea.node());

            this.mainCanvasNode = canvas.call(createZoomBehavior(canvas))
                .on('wheel', event => (event as Event).preventDefault())
                .node();
            this.emptyCanvasDataUrl = this.mainCanvasNode.toDataURL();
            this.canvasContext = this.mainCanvasNode.getContext('2d');
            this.highlightLayer = this.waferArea.append('svg')
                .attr('width', this.canvasWidth)
                .attr('height', this.canvasHeight);
        }
    }

    private setContainerClass(elm: HTMLElement): void {
        const className = 'wafermap-default';
        select(elm)
            .classed(className, true);
    }

    private setContainerSize(elm: HTMLElement): void {
        this.canvasWidth = elm.offsetWidth;
        this.canvasHeight = elm.offsetHeight;
    }

    private createCanvasElement(container: HTMLElement): Selection<HTMLCanvasElement, unknown, HTMLElement, undefined> {
        return select(container)
            .append('canvas')
            .attr('width', this.canvasWidth)
            .attr('height', this.canvasHeight);
    }

    private drawWafer(context: CanvasRenderingContext2D, clearContext = true, isHiddenContext = false): void {
        if (clearContext) {
            this.clearCanvas(context, this.canvasWidth, this.canvasHeight);
        }
        const diceElems = this.container.selectAll('.die');

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        const zoomValue = self.zoomTransform.k || 1;
        const dieSize = (self.gridWidth * zoomValue) * (self.gridHeight * zoomValue);

        diceElems.each(function drawDiceElems() {
            const node = select(this);
            const diePoint: Point = {
                x: +node.attr('x'),
                y: +node.attr('y')
            };

            const opacity = Number(node.attr('opacity'));
            if (!isHiddenContext && opacity > 0) {
                let hex = node.attr('fillStyle');
                hex = hex.replace(/[^0-9A-F]/gi, '');
                const bigint = parseInt(hex, 16);
                /* eslint-disable no-bitwise */
                // These bitwise operators are intentional
                const r = (bigint >> 16) & 255;
                const g = (bigint >> 8) & 255;
                const b = bigint & 255;
                /* eslint-enable no-bitwise */
                const a = Number(node.attr('opacity'));

                context.fillStyle = `rgba(${[r, g, b, a].join(',')})`;
            } else {
                context.fillStyle = isHiddenContext ? node.attr('colorKey') : node.attr('fillStyle'); // here you apply the colour
            }

            context.fillRect(diePoint.x, diePoint.y, self.gridWidth, self.gridHeight); // and here you draw the square

            if (self.showLabels && dieSize >= 100 && !isHiddenContext) {
                context.font = `${self.labelsFontSize}px sans-serif`;
                context.fillStyle = '#ffffff';
                context.textAlign = 'center';
                const aproxTextHeight = (context.measureText('M'));
                context.fillText(node.text(), diePoint.x + (self.gridWidth / 2), diePoint.y
          + (self.gridHeight / 2) + (aproxTextHeight.width / 2));
            }
        });

        if (!isHiddenContext) {
            this.createHoverDie();
        }

        this.isDrawing = false;
    }
}

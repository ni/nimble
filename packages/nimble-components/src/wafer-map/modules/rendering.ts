import type { WaferMap } from '..';
import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule extends EventTarget{
    private readonly context: CanvasRenderingContext2D;
    private dieSize?: number;
    private readonly dies: DieRenderInfo[];
    private readonly dimensions: Dimensions;
    private readonly labelFontSize: number;

    public constructor(wafermap:WaferMap) {
        super();
        this.context = wafermap.canvas.getContext('2d')!;
        this.dies = wafermap.dataManager!.diesRenderInfo;
        this.dimensions = wafermap.dataManager!.dieDimensions;
        this.labelFontSize = wafermap.dataManager!.labelsFontSize;
    }

    public drawWafer(transform?: number): void {
        console.log('start draw wafer');
        this.renderDies();
        this.renderText(transform);
        this.context.restore();
        this.dispatchEvent(
            new CustomEvent('render-complete')
        );
    }

    public clearCanvas(width: number, height: number): void {
        this.context.clearRect(0, 0, width, height);
    }

    private renderDies(): void {
        // this.dieSize = this.dimensions.width * this.dimensions.height * (transform || 1);
        this.dies.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });

        let prev: DieRenderInfo | undefined;

        for (const die of this.dies) {
            if (!prev) {
                this.context.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
                this.context.fillStyle = die.fillStyle;
            }
            // console.log(die);
            this.context.fillRect(
                die.x,
                die.y,
                this.dimensions.width,
                this.dimensions.height
            );
            prev = die;
        }
    }

    private renderText(transform?: number): void {
        this.dieSize = this.dimensions.width * this.dimensions.height * (transform || 1);
        const fontsize = this.labelFontSize;
        this.context.font = `${fontsize.toString()}px sans-serif`;
        this.context.fillStyle = '#ffffff';
        this.context.textAlign = 'center';
        this.context.lineCap = 'butt';
        const aproxTextHeight = this.context.measureText('M');

        if (this.dieSize >= 50) {
            for (const die of this.dies) {
                this.context.fillText(
                    die.text,
                    die.x + this.dimensions.width / 2,
                    die.y
                        + this.dimensions.height / 2
                        + aproxTextHeight.width / 2,
                    this.dimensions.width - (this.dimensions.width / 100) * 20
                );
            }
        }
    }
}

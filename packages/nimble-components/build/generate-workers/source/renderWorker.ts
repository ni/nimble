import * as Comlink from 'comlink';
/**
 * render worker
 */
export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private worker!: number;
    private context!: OffscreenCanvasRenderingContext2D;
    private scaledColIndex!: Float64Array;
    private colIndexPositions!: Int32Array;
    private scaledRowIndex!: Float64Array;
    private value!: Float32Array;
    private verticalScale: { a: number, b: number } = { a: 0, b: 1 };
    private horizontalScale: { a: number, b: number } = { a: 0, b: 1 };
    private margin: { top: number, right: number } = { top: 0, right: 0 };
    private dieDimensions: { width: number, height: number } = { width: 1, height: 1 };
    private colorCategories: { color: string, startValue: number, endValue?: number }[] = [];
    private yLimits: { min: number, max: number } = { min: 0, max: 0 };
    private xLimits: { min: number, max: number } = { min: 0, max: 0 };
    private transform: { k: number, x: number, y: number } = { k: 1, x: 0, y: 0 };
    private performanceTest: string | undefined;
    private colIndex = 0;
    private numCols = 0;

    public setCanvasDimensions(data: { width: number, height: number }): void {
        this.canvas.width = data.width;
        this.canvas.height = data.height;
    }

    public saveContext(): void {
        this.context.save();
    }

    public restoreContext(): void {
        this.context.restore();
    }

    public clearCanvas(): void {
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    public scaleCanvas(data: { transform: { k: number, x: number, y: number } }): void {
        this.context.translate(
            data.transform.x,
            data.transform.y
        );
        this.context.scale(
            data.transform.k,
            data.transform.k
        );
    }

    public setCanvas(canvas: OffscreenCanvas): void {
        this.canvas = canvas;
        this.context = canvas.getContext('2d', {
            willReadFrequently: true
        })!;
    }

    public updateRenderConfig(
        data: {
            colorCategories: { color: string, startValue: number, endValue?: number }[],
            verticalScale: { a: number, b: number },
            horizontalScale: { a: number, b: number },
            margin: { top: number, right: number },
            xLimits: { min: number, max: number },
            yLimits: { min: number, max: number },
            transform: { k: number, x: number, y: number },
            dieDimensions: { width: number, height: number }
        }
    ): void {
        this.horizontalScale = data.horizontalScale;
        this.verticalScale = data.verticalScale;
        this.margin = data.margin;
        this.yLimits = data.yLimits;
        this.xLimits = data.xLimits;
        this.dieDimensions = data.dieDimensions;
        this.colorCategories = data.colorCategories;
        this.transform = data.transform;
    }

    private renderDiesAnimation (prevTime: DOMHighResTimeStamp ): void {
        // console.log('renderDiesAnimation', prevTime);
        for (let cols = 0; this.colIndex < this.scaledColIndex.length && cols < this.numCols ; this.colIndex++, cols++) {
            const scaledX = this.scaledColIndex[this.colIndex]!;
            if (
                scaledX >= this.xLimits.min
                && scaledX < this.xLimits.max
            ) {
                for (let rowPosition = this.colIndexPositions[this.colIndex]!,
                    length = this.colIndexPositions[this.colIndex + 1] !== undefined ? this.colIndexPositions[this.colIndex + 1]! : this.scaledRowIndex.length;
                    rowPosition < length; rowPosition++) {
                    const scaledY = this.scaledRowIndex[rowPosition]!;
                    if (
                        scaledY >= this.yLimits.min
                        && scaledY < this.yLimits.max
                    ) {
                        const value = this.value[rowPosition]!;
                        const category = this.colorCategories.find(cat => cat.startValue <= value && (cat.endValue === undefined || cat.endValue > value));
                        this.context.fillStyle = category ? category.color : 'blue';
                        this.context.fillRect(scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
                    }
                }
            }
        }
        if(this.colIndex < this.scaledColIndex.length ) {
            self.requestAnimationFrame(this.renderDiesAnimation.bind(this));
        }
    }

    public renderDies(): void {
        const start = this.performanceTest !== undefined ? self.performance.now() : undefined;
        this.numCols = 100000;
        this.colIndex = 0;
        self.requestAnimationFrame(this.renderDiesAnimation.bind(this));
        if (this.performanceTest !== undefined) {
            self.requestAnimationFrame(() => {});
            self.performance.measure(`${this.performanceTest} - worker:${this.worker} - renderDies`, { start });
        }
    }

    public renderText(): void {
        const dieSize = this.dieDimensions.width * this.dieDimensions.height * (this.transform.k || 1);
        if (dieSize >= 50) {
            const approximateTextHeight = this.context.measureText('M').width;
            this.context.font = `${Math.min(this.dieDimensions.height, this.dieDimensions.width * 0.8).toString()}px sans-serif`;
            this.context.fillStyle = '#ffffff';
            this.context.textAlign = 'center';
            this.context.lineCap = 'butt';

            for (let colIndex = 0, length = this.scaledColIndex.length; colIndex < length; colIndex++) {
                const scaledX = this.scaledColIndex[colIndex]!;
                if (
                    scaledX >= this.xLimits.min
                    && scaledX < this.xLimits.max
                ) {
                    for (let rowPosition = this.colIndexPositions[colIndex]!,
                        length = this.colIndexPositions[colIndex + 1] !== undefined ? this.colIndexPositions[colIndex + 1]! : this.scaledRowIndex.length;
                        rowPosition < length; rowPosition++) {
                    const scaledY = this.scaledRowIndex[rowPosition]!;
                        if (
                            scaledY >= this.yLimits.min
                            && scaledY < this.yLimits.max
                        ) {
                            this.context.fillText(
                                this.value[rowPosition]!.toFixed(1),
                                scaledX + this.dieDimensions.width / 2,
                                scaledY + this.dieDimensions.height - approximateTextHeight,
                                this.dieDimensions.width - (this.dieDimensions.width / 5)
                            );
                        }
                    }
                }
            }
        }
    }

    public setBuffers(data: { colIndex: Int32Array, rowIndex: Int32Array, value: Float32Array }): void {
        const scaledColIndex: number[] =[];
        const colPosition = [];
        for (let i = 0, length = data.colIndex.length; i < length; i++) {
            const xIndex = data.colIndex[i];
            if (xIndex && xIndex !== scaledColIndex[scaledColIndex.length - 1]) {
                const scaledX = this.horizontalScale.a + this.horizontalScale.b * xIndex + this.margin.right;
                scaledColIndex.push(scaledX);
                colPosition.push(i);
            }
        }
        this.scaledColIndex = Float64Array.from(scaledColIndex);
        this.colIndexPositions = Int32Array.from(colPosition);
        const scaledRowIndex: number[] =[];
        const colors: number[] = [];
        for (let i = 0, length = data.rowIndex.length; i < length; i++) {
            scaledRowIndex.push(this.verticalScale.a + this.verticalScale.b * data.rowIndex[i]! + this.margin.top);
        }
        this.scaledRowIndex = Float64Array.from(scaledRowIndex);
        this.value = data.value;
    }
}

const renderWorker = new RenderWorker()

Comlink.expose(renderWorker);
/**
 * render worker
 */
export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private worker!: number;
    private context!: OffscreenCanvasRenderingContext2D;
    private dieMatrix: {
        // the x coordinates of each column of dies
        dieColIndexArray: Int32Array;
        // the lengths of each row of dies
        rowLengthsArray: Int32Array;
        // the y coordinates of each die as a matrix row by row
        dieRowIndexLayer: Int32Array;
        // the value of each die as a matrix row by row
        dieValuesLayer: Int32Array;
        // the highlight state of each die as a matrix row by row
        dieHighlightsLayer: Int8Array;
    } = {
        dieColIndexArray: Int32Array.from([]),
        rowLengthsArray: Int32Array.from([]),
        dieRowIndexLayer: Int32Array.from([]),
        dieValuesLayer: Int32Array.from([]),
        dieHighlightsLayer: Int8Array.from([])
    };
    private verticalScale: { a: number, b: number } = { a: 0, b: 1 };
    private horizontalScale: { a: number, b: number } = { a: 0, b: 1 };
    private margin: { top: number, right: number } = { top: 0, right: 0 };
    private dieDimensions: { width: number, height: number } = { width: 1, height: 1 };
    private colorCategories: { color: string, startValue: number, endValue?: number }[] = [];
    private yLimits: { min: number, max: number } = { min: 0, max: 0 };
    private xLimits: { min: number, max: number } = { min: 0, max: 0 };
    private transform: { k: number, x: number, y: number } = { k: 1, x: 0, y: 0 };

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

    public setCanvas(data: { canvas: OffscreenCanvas, worker: number }): void {
        this.canvas = data.canvas;
        this.worker = data.worker;
        this.context = data.canvas.getContext('2d', {
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

    public emptyMatrix(): void {
        this.dieMatrix = {
            dieColIndexArray: Int32Array.from([]),
            rowLengthsArray: Int32Array.from([]),
            dieRowIndexLayer: Int32Array.from([]),
            dieValuesLayer: Int32Array.from([]),
            dieHighlightsLayer: Int8Array.from([])
        };
    }

    public rerenderDies(): void {
        let startRowIndex = 0
        for (let index = 0; index < this.dieMatrix.dieColIndexArray.length; index++) {
            const colIndex = this.dieMatrix.dieColIndexArray[index]!;
            const rowLength = this.dieMatrix.rowLengthsArray[index]!;
            const scaledX = this.horizontalScale.a + this.horizontalScale.b * (+colIndex) + this.margin.right;
            if (
                index % 2 === this.worker
                && scaledX >= this.xLimits.min
                && scaledX < this.xLimits.max
            ) {
                for (let layerIndex = 0; layerIndex < rowLength; layerIndex++) {
                    const rowIndex = this.dieMatrix.dieRowIndexLayer[startRowIndex + layerIndex]!;
                    const value = this.dieMatrix.dieValuesLayer[startRowIndex + layerIndex]!;
                    const scaledY = this.verticalScale.a + this.verticalScale.b * rowIndex + this.margin.top;
                    if (
                        scaledY >= this.yLimits.min
                        && scaledY < this.yLimits.max
                    ) {
                        const category = this.colorCategories.find(cat => cat.startValue <= value && (cat.endValue === undefined || cat.endValue > value));
                        this.context.fillStyle = category ? category.color : 'blue';
                        this.context.fillRect(scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
                    }
                }
            }
            startRowIndex += rowLength;
        }
    }

    public rerenderText(): void {
        const dieSize = this.dieDimensions.width * this.dieDimensions.height * (this.transform.k || 1);
        if (dieSize >= 50) {
            const approximateTextHeight = this.context.measureText('M').width;
            this.context.font = `${Math.min(this.dieDimensions.height, this.dieDimensions.width * 0.8).toString()}px sans-serif`;
            this.context.fillStyle = '#ffffff';
            this.context.textAlign = 'center';
            this.context.lineCap = 'butt';

            
        let startRowIndex = 0
        for (let index = 0; index < this.dieMatrix.dieColIndexArray.length; index++) {
            const colIndex = this.dieMatrix.dieColIndexArray[index]!;
            const rowLength = this.dieMatrix.rowLengthsArray[index]!;
            const scaledX = this.horizontalScale.a + this.horizontalScale.b * (+colIndex) + this.margin.right;
            if (
                scaledX >= this.xLimits.min
                && scaledX < this.xLimits.max
            ) {
                for (let layerIndex = 0; layerIndex < rowLength; layerIndex++) {
                    const rowIndex = this.dieMatrix.dieRowIndexLayer[startRowIndex + layerIndex]!;
                    const value = this.dieMatrix.dieValuesLayer[startRowIndex + layerIndex]!;
                    const scaledY = this.verticalScale.a + this.verticalScale.b * rowIndex + this.margin.top;
                    if (
                        scaledY >= this.yLimits.min
                        && scaledY < this.yLimits.max
                    ) {
                            this.context.fillText(
                                value.toFixed(1),
                                scaledX + this.dieDimensions.width / 2,
                                scaledY + this.dieDimensions.height - approximateTextHeight,
                                this.dieDimensions.width - (this.dieDimensions.width / 5)
                            );
                        }
                    }
                }
                startRowIndex += rowLength;
            }
        }
    }

    public renderDies(
        data: {
            dieColIndexArray: Iterable<number>,
            rowLengthsArray: Iterable<number>,
            dieRowIndexLayer: Iterable<number>,
            dieValuesLayer: Iterable<number>,
        }
    ): void {
        this.dieMatrix.dieColIndexArray = Int32Array.from(data.dieColIndexArray);
        this.dieMatrix.rowLengthsArray = Int32Array.from(data.rowLengthsArray);
        this.dieMatrix.dieRowIndexLayer = Int32Array.from(data.dieRowIndexLayer);
        this.dieMatrix.dieValuesLayer = Int32Array.from(data.dieValuesLayer);
        this.rerenderDies();
    }
}
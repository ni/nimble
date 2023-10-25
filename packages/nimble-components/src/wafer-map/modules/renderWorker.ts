/**
 * render worker
 */
export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private context!: OffscreenCanvasRenderingContext2D;
    private readonly dieMatrix: { [key: number]: Int32Array } = {};
    private readonly valueMatrix: { [key: number]: Float32Array } = {};
    private verticalScale: { a: number, b: number } = { a: 0, b: 1 };
    private margin: { top: number } = { top: 0 };
    private dieDimensions: { width: number, height: number } = { width: 1, height: 1 };
    private colorCategories: { color: string, startValue: number, endValue?: number }[] = [];
    private limits: { min: number, max: number } = { min: 0, max: 0 };
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

    public setCanvas(data: { canvas: OffscreenCanvas }): void {
        this.canvas = data.canvas;
        this.context = data.canvas.getContext('2d', {
            willReadFrequently: true
        })!;
    }

    public updateRenderConfig(
        data: {
            colorCategories: { color: string, startValue: number, endValue?: number }[],
            verticalScale: { a: number, b: number },
            margin: { top: number },
            limits: { min: number, max: number },
            transform: { k: number, x: number, y: number },
            dieDimensions: { width: number, height: number }
        }
    ): void {
        this.verticalScale = data.verticalScale;
        this.margin = data.margin;
        this.limits = data.limits;
        this.dieDimensions = data.dieDimensions;
        this.colorCategories = data.colorCategories;
        this.transform = data.transform;
    }

    public render(
        data: {
            xIndex: number,
            scaledX: number,
            yBuffer: Iterable<number>,
            valueBuffer: Iterable<number>
        }
    ): void {
        if (this.dieMatrix[data.xIndex] === undefined) {
            this.dieMatrix[data.xIndex] = new Int32Array(data.yBuffer);
            this.valueMatrix[data.xIndex] = new Float32Array(data.valueBuffer);
        }
        const yIndexes = this.dieMatrix[data.xIndex]!;
        const values = this.valueMatrix[data.xIndex]!;
        for (let index = 0; index < yIndexes.length; index++) {
            const scaledY = this.verticalScale.a + this.verticalScale.b * yIndexes[index]! + this.margin.top;
            if (
                scaledY !== undefined
                && scaledY >= this.limits.min
                && scaledY < this.limits.max
            ) {
                const category = this.colorCategories.find(cat => cat.startValue <= values[index]! && (cat.endValue === undefined || cat.endValue > values[index]!));
                this.context.fillStyle = category ? category.color : 'blue';
                this.context.fillRect(data.scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
            }
        }
        const dieSize = this.dieDimensions.width * this.dieDimensions.height * (this.transform.k || 1);
        if (dieSize >= 50) {
            const approximateTextHeight = this.context.measureText('M').width / 2;
            this.context.font = `${Math.min(this.dieDimensions.height, this.dieDimensions.width * 0.8).toString()}px sans-serif`;
            this.context.fillStyle = '#ffffff';
            this.context.textAlign = 'center';
            this.context.lineCap = 'butt';
            for (let index = 0; index < yIndexes.length; index++) {
                const scaledY = this.verticalScale.a + this.verticalScale.b * yIndexes[index]! + this.margin.top;
                if (
                    scaledY !== undefined
                && scaledY >= this.limits.min
                && scaledY < this.limits.max
                ) {
                    this.context.fillText(
                        values[index]!.toFixed(1),
                        data.scaledX + this.dieDimensions.width / 2,
                        scaledY + this.dieDimensions.height / 2 + approximateTextHeight,
                        this.dieDimensions.width - (this.dieDimensions.width / 5)
                    );
                }
            }
        }
    }
}
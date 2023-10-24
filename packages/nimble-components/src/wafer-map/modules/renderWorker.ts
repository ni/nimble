/**
 * render worker
 */
export class RenderWorker {
    private canvas!: OffscreenCanvas;
    private context!: OffscreenCanvasRenderingContext2D;
    private readonly dieMatrix: { [key: number]: Int32Array } = {};
    private verticalScale: { a: number, b: number } = { a: 0, b: 1 };
    private margin: { top: number } = { top: 0 };
    private dieDimensions: { width: number, height: number } = { width: 1, height: 1 };
    private limits: { min: number, max: number } = { min: 0, max: 0 };

    public setCanvasDimensions(data: { width: number, height: number }): void {
        console.log('setCanvasDimensions', data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.canvas.width = data.width;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.canvas.height = data.height;
    }

    public saveContext(): void {
        console.log('saveContext');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context.save();
    }

    public restoreContext(): void {
        console.log('restoreContext');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context.restore();
    }

    public clearCanvas(): void {
        console.log('clearCanvas');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context.clearRect(
            0,
            0,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,
            this.canvas.width,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,
            this.canvas.height
        );
    }

    public scaleCanvas(data: { transform: { k: number, x: number, y: number } }): void {
        console.log('scaleCanvas', data);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context.translate(
            data.transform.x,
            data.transform.y
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context.scale(
            data.transform.k,
            data.transform.k
        );
    }

    public setCanvas(data: { canvas: OffscreenCanvas }): void {
        console.log('setCanvas');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        this.canvas = data.canvas;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        this.context = data.canvas.getContext('2d', {
            willReadFrequently: true
        })!;
    }

    public updateRenderConfig(
        data: {
            verticalScale: { a: number, b: number },
            margin: { top: number },
            limits: { min: number, max: number },
            dieDimensions: { width: number, height: number }
        }
    ): void {
        this.verticalScale = data.verticalScale;
        this.margin = data.margin;
        this.limits = data.limits;
        this.dieDimensions = data.dieDimensions;
    }

    public render(
        data: {
            xIndex: number,
            scaledX: number,
            buffer: Iterable<number>
        }
    ): void {
        requestAnimationFrame(() => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            this.context.fillStyle = 'blue';
            if (this.dieMatrix[data.xIndex] === undefined) {
                this.dieMatrix[data.xIndex] = new Int32Array(data.buffer);
            }
            const yIndexes = this.dieMatrix[data.xIndex]!;
            // eslint-disable-next-line @typescript-eslint/prefer-for-of
            for (let index = 0; index < yIndexes.length; index++) {
                const scaledY = this.verticalScale.a + this.verticalScale.b * yIndexes[index]! + this.margin.top;
                if (
                    scaledY !== undefined
                && scaledY >= this.limits.min
                && scaledY < this.limits.max
                ) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    this.context.fillRect(data.scaledX, scaledY, this.dieDimensions.width, this.dieDimensions.height);
                }
            }
        });
    }
}
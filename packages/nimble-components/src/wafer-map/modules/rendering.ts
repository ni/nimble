import type { DieRenderInfo, Dimensions } from '../types';
import type { DataManager } from './data-manager';

/**
 * Responsible for drawing the dies inside the wafer map
 */
export class RenderingModule {
    private readonly context: CanvasRenderingContext2D;
    private readonly gl: WebGLRenderingContext;
    private dieSize?: number;
    private readonly dies: DieRenderInfo[];
    private readonly dimensions: Dimensions;
    private readonly labelFontSize: number;

    public constructor(waferData: DataManager, canvas: HTMLCanvasElement) {
        this.gl = canvas.getContext('webgl')!;
        this.context = canvas.getContext('2d')!;
        this.dies = waferData.diesRenderInfo;
        this.dimensions = waferData.dieDimensions;
        this.labelFontSize = waferData.labelsFontSize;
    }

    public drawWafer(transform?: number): void {
        this.renderDies(transform);
        this.renderText(transform);
    }

    public clearCanvas(width: number, height: number): void {
        this.context.clearRect(0, 0, width, height);
    }

    public webGLRender(): void {
        if (!this.gl) {
            return;
        }

        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader!, `
        attribute vec4 a_position;
        attribute vec4 a_color;
        uniform vec2 u_resolution;
        varying vec4 v_color;

        void main() {
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position.xy / u_resolution;
        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace, 0, 1);
        v_color = a_color;
        }`);
        this.gl.compileShader(vertexShader!);

        // precision mediump float;

        // void main() {
        //     gl_FragColor = vec4(1, 0, 0.5, 1);
        // }`

        // precision mediump float;
        // uniform vec4 u_color;

        // void main() {
        // gl_FragColor = u_color;
        // }

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader!, `
        precision mediump float;
        varying vec4 v_color;
        
        void main() {
          gl_FragColor = v_color;
        }`);

        this.gl.compileShader(fragmentShader!);

        const program = this.gl.createProgram();
        this.gl.attachShader(program!, vertexShader!);
        this.gl.attachShader(program!, fragmentShader!);
        this.gl.linkProgram(program!);

        // look up where the vertex data needs to go.
        const positionLocation = this.gl.getAttribLocation(program!, 'a_position');

        // look up where the fragment data needs to go.
        const colorLocation = this.gl.getAttribLocation(program!, 'a_color');

        // look up uniform locations
        const resolutionUniformLocation = this.gl.getUniformLocation(program!, 'u_resolution');

        const pos = [];
        const colorPalette = [];
        const width = this.dimensions.width;
        for (const die of this.dies) {
            const x1 = die.x;
            const x2 = die.x + width;
            const y1 = die.y;
            const y2 = die.y + width;

            pos.push(
                x1,
                y1,
                x2,
                y1,
                x1,
                y2,
                x1,
                y2,
                x2,
                y1,
                x2,
                y2,
            );

            const colors = die.fillStyle.split(',');
            colors[0] = colors[0]?.replace('rgba(', '') || '';
            colors[3] = colors[3]?.replace(')', '') || '';
            const rgb = this.converRgbToFloat(colors);

            //debugger;
            const r = rgb[0] || 0;
            const g = rgb[1] || 0;
            const b = rgb[2] || 0;
            const a = 1 || 0;
            colorPalette.push(
                r,
                g,
                b,
                a,
                r,
                g,
                b,
                a,
                r,
                g,
                b,
                a,
                r,
                g,
                b,
                a,
                r,
                g,
                b,
                a,
                r,
                g,
                b,
                a,
            );
        }

        // Create a buffer to put three 2d clip space points in
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pos), this.gl.STATIC_DRAW);

        const colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorPalette), this.gl.STATIC_DRAW);

        // Tell WebGL how to convert from clip space to pixels
        // this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(program);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const pSize = 2; // 2 components per iteration
        const pType = this.gl.FLOAT; // the data is 32bit floats
        const pNormalize = false; // don't normalize the data
        const pStride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        this.gl.vertexAttribPointer(positionLocation, pSize, pType, pNormalize, pStride, 0);
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);

        this.gl.enableVertexAttribArray(colorLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);

        // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
        const cSize = 4; // 4 components per iteration
        const cType = this.gl.FLOAT; // the data is 32bit floats
        const cNormalize = false; // don't normalize the data
        const cStride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        const cOffset = 0; // start at the beginning of the buffer
        this.gl.vertexAttribPointer(colorLocation, cSize, cType, cNormalize, cStride, cOffset);

        // const fColorLocation = this.gl.getUniformLocation(program!, 'u_color');
        // for (const die of this.dies) {
        //     this.setRectangle(die.x, die.y, this.dimensions.width);
        //     const colors = die.fillStyle.split(',');
        //     colors[0] = colors[0]?.replace('rgba(', '') || '';
        //     colors[3] = colors[3]?.replace(')', '') || '';
        //     const rgb = this.converRgbToFloat(colors);
        //     debugger;
        //     this.gl.uniform4f(fColorLocation, rgb[0]!, rgb[1]!, rgb[2]!, 1);

        //     // Draw the rectangle.
        //     const primitiveType = this.gl.TRIANGLES;
        //     const offset = 0;
        //     const count = 6;
        //     this.gl.drawArrays(primitiveType, offset, count);
        // }
        // const pos = [];
        // const colorPalette = [];
        // const width = this.dimensions.width;
        // for (const die of this.dies) {
        //     const x1 = die.x;
        //     const x2 = die.x + width;
        //     const y1 = die.y;
        //     const y2 = die.y + width;

        //     pos.push(
        //         x1,
        //         y1,
        //         x2,
        //         y1,
        //         x1,
        //         y2,
        //         x1,
        //         y2,
        //         x2,
        //         y1,
        //         x2,
        //         y2,
        //     );

        //     const colors = die.fillStyle.split(',');
        //     colors[0] = colors[0]?.replace('rgba(', '') || '';
        //     colors[3] = colors[3]?.replace(')', '') || '';
        //     const rgb = this.converRgbToFloat(colors);

        //     debugger;
        //     const r = rgb[0] || 0;
        //     const g = rgb[1] || 0;
        //     const b = rgb[2] || 0;
        //     const a = 1 || 0;
        //     colorPalette.push(
        //         r,
        //         g,
        //         b,
        //         a,
        //         r,
        //         g,
        //         b,
        //         a,
        //         r,
        //         g,
        //         b,
        //         a,
        //     );
        // }

        debugger;
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(pos), this.gl.STATIC_DRAW);
        // this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorPalette), this.gl.STATIC_DRAW);
        // Draw the rectangle.
        const primitiveType = this.gl.TRIANGLES;
        const offset = 0;
        const count = this.dies.length * 12;
        this.gl.drawArrays(primitiveType, offset, count);
    }

    private setRectangle(x: number, y: number, width: number): void {
        const x1 = x;
        const x2 = x + width;
        const y1 = y;
        const y2 = y + width;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2,
        ]), this.gl.STATIC_DRAW);
    }

    private setColors(color: string) {
        // Pick 2 random colors.
        const colorPalette = [];
        const colors = color.split(',');
        colors[0] = colors[0]?.replace('rgba(', '') || '';
        colors[3] = colors[3]?.replace(')', '') || '';
        const rgb = this.converRgbToFloat(colors);

        colorPalette.push(
            rgb[0],
            rgb[1],
            rgb[2],
            rgb[3],
            1,
            rgb[0],
            rgb[1],
            rgb[2],
            rgb[3],
            1,
        );
    }

    private converRgbToFloat(colors: string[]): number[] {
        const rgbArray = [];
        for (const color of colors) {
            rgbArray.push((parseInt(color, 10)) / 255.0);
        }
        return rgbArray;
    }

    private renderDies(transform?: number): void {
        this.dieSize = this.dimensions.width * this.dimensions.height * (transform || 1);
        this.dies.sort((a, b) => {
            if (a.fillStyle > b.fillStyle) {
                return 1;
            }
            if (b.fillStyle > a.fillStyle) {
                return -1;
            }

            return 0;
        });

        let prev!: DieRenderInfo;

        for (const die of this.dies) {
            if (!prev) {
                this.context.fillStyle = die.fillStyle;
            }
            if (prev && die.fillStyle !== prev.fillStyle && die.fillStyle) {
                this.context.fillStyle = die.fillStyle;
            }
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

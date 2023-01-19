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
        // Get A WebGL context
        if (!this.gl) {
            return;
        }

        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vertexShader!, `
        attribute vec4 a_position;
        uniform vec2 u_resolution;
        void main() {
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = a_position.xy / u_resolution;
        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace, 0, 1);
        }`);
        this.gl.compileShader(vertexShader!);

        // let success = this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS);
        // if (!success) {
        //     // Something went wrong during compilation; get the error
        //     throw `could not compile shader:${gl.getShaderInfoLog(shader)}`;
        // }

        // precision mediump float;

        // void main() {
        //     gl_FragColor = vec4(1, 0, 0.5, 1);
        // }`

        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fragmentShader!, `
        precision mediump float;
        uniform vec4 u_color;

        void main() {
        gl_FragColor = u_color;
        }`);

        this.gl.compileShader(fragmentShader!);
        // var success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
        // if (!success) {
        //     // Something went wrong during compilation; get the error
        //     throw `could not compile shader:${gl.getShaderInfoLog(shader)}`;
        // }

        const program = this.gl.createProgram();
        this.gl.attachShader(program!, vertexShader!);
        this.gl.attachShader(program!, fragmentShader!);
        this.gl.linkProgram(program!);

        // var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        // if (!success) {
        //     // something went wrong with the link
        //     throw (`program failed to link:${gl.getProgramInfoLog(program)}`);
        // }

        // look up where the vertex data needs to go.
        const positionAttributeLocation = this.gl.getAttribLocation(program!, 'a_position');

        // look up uniform locations
        const resolutionUniformLocation = this.gl.getUniformLocation(program!, 'u_resolution');

        // Create a buffer to put three 2d clip space points in
        const positionBuffer = this.gl.createBuffer();

        // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        const positions: number[] = [];
        let currentDie = 0;
        let shaderPosition = 0;
        debugger;
        for (let i = 0; i < this.dies.length * 12; i++) {
            switch (shaderPosition) {
                case 0:
                    positions[i] = this.dies[currentDie]?.x || 0;
                    break;
                case 1:
                    positions[i] = this.dies[currentDie]?.y || 0;
                    break;
                case 2:
                    positions[i] = (this.dies[currentDie]?.x || 0) + this.dimensions.width;
                    break;
                case 3:
                    positions[i] = this.dies[currentDie]?.y || 0;
                    break;
                case 4:
                    positions[i] = this.dies[currentDie]?.x || 0;
                    break;
                case 5:
                    positions[i] = (this.dies[currentDie]?.y || 0) + this.dimensions.width;
                    break;
                case 6:
                    positions[i] = this.dies[currentDie]?.x || 0;
                    break;
                case 7:
                    positions[i] = (this.dies[currentDie]?.y || 0) + this.dimensions.width;
                    break;
                case 8:
                    positions[i] = (this.dies[currentDie]?.x || 0) + this.dimensions.width;
                    break;
                case 9:
                    positions[i] = this.dies[currentDie]?.y || 0;
                    break;
                case 10:
                    positions[i] = (this.dies[currentDie]?.x || 0) + this.dimensions.width;
                    break;
                case 11:
                    positions[i] = (this.dies[currentDie]?.y || 0) + this.dimensions.width;
                    break;
                default:
                    break;
            }
            shaderPosition += 1;
            if (shaderPosition > 11) {
                shaderPosition = 0;
                currentDie += 1;
            }
        }

        debugger;

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

        // webglUtils.resizeCanvasToDisplaySize(this.gl.canvas);

        // const width = this.gl.canvas.clientWidth;
        // const height = this.gl.canvas.clientHeight;
        // if (this.gl.canvas.width !== width || this.gl.canvas.height !== height) {
        //     this.gl.canvas.width = width;
        //     this.gl.canvas.height = height;
        // }

        // Tell WebGL how to convert from clip space to pixels
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

        // Clear the canvas
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Tell it to use our program (pair of shaders)
        this.gl.useProgram(program);

        // Turn on the attribute
        this.gl.enableVertexAttribArray(positionAttributeLocation);

        // Bind the position buffer.
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
        const size = 2; // 2 components per iteration
        const type = this.gl.FLOAT; // the data is 32bit floats
        const normalize = false; // don't normalize the data
        const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
        this.gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, 0);

        // const colorLocation = this.gl.getAttribLocation(program!, 'color');
        // this.gl.enableVertexAttribArray(colorLocation);
        // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
        // this.gl.vertexAttribPointer(colorLocation, 3, this.gl.FLOAT, false, 0, 0);
        // set the resolution
        this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
        const fColorLocation = this.gl.getUniformLocation(program!, 'u_color');
        this.gl.uniform4f(fColorLocation, Math.random(), Math.random(), Math.random(), 1);
        // draw
        const primitiveType = this.gl.TRIANGLES;
        const count = this.dies.length * 12;
        this.gl.drawArrays(primitiveType, 0, count);
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

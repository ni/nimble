import type { WaferMapDataType } from '../types';
import type { WaferMapDie } from './WaferMapDie';
import { WaferMapMetadata } from './WaferMapMetadata';

/**
 * WaferMapRenderingObject
 */
export class WaferMapRenderingObject {
    public dice!: WaferMapDie[];
    public metadata: WaferMapMetadata = new WaferMapMetadata();
    public maxCharacters!: number;
    public waferDataType!: WaferMapDataType;
    public colorsScale: string[] | null = null;

    public get isEmpty(): boolean { return !this.dice || !(this.dice.length > 0); }
}

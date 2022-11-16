import type { WaferMapDataType, WaferMapDie } from '../types';
import type { WaferMapMetadata } from './wafer-map-metadata';

/**
 * Represents the rendering object for a wafer map component
 */
export class WaferMapRenderingObject {
    public constructor(
        public dice: WaferMapDie[],
        public metadata: WaferMapMetadata,
        public maxCharacters: number,
        public waferDataType: WaferMapDataType,
        public colorsScale?: string[]
    ) { }

    public get isEmpty(): boolean {
        return !(this.dice.length > 0);
    }
}

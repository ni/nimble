import type { WaferMapOrientation, WaferMapQuadrant } from '../types';

/**
 * Represents the metadata for a wafer map component
 */
export class WaferMapMetadata {
    public constructor(
        public axisLocation: WaferMapQuadrant,
        public notchOrientation: WaferMapOrientation,
        public cols: number,
        public rows: number,
        public origin: { x: number, y: number }
    ) {}
}

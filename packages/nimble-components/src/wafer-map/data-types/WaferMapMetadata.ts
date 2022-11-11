import type { Orientation, Quadrant } from '../types';

/**
 * WaferMapMetadata
 */
export class WaferMapMetadata {
    public axisLocation!: Quadrant;
    public notchOrientation!: Orientation;
    public cols!: number;
    public rows!: number;
    public origin!: { x: number, y: number };
}

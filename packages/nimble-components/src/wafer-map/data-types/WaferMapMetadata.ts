import { Orientation, Quadrant } from '../types';

/**
 * WaferMapMetadata
 */
export class WaferMapMetadata {
    public axisLocation: Quadrant = Quadrant.topLeft;
    public notchOrientation: Orientation = Orientation.top;
    public cols = 0;
    public rows = 0;
    public origin!: { x: number, y: number };
}

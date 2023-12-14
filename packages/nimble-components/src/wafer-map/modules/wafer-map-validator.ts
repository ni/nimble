import type { WaferMap } from '..';
import type { WaferMapValidity } from '../types';

/**
 * Helper class for the nimble-wafer-map to validate that the wafer maps's grid dimensions
 * configuration is valid and report which aspects of the configuration are valid or invalid.
 */
export class WaferMapValidator {
    private invalidGridDimensions = false;

    public constructor(private readonly wafermap: WaferMap) {}
    public getValidity(): WaferMapValidity {
        return {
            invalidGridDimensions: this.invalidGridDimensions
        };
    }

    public isValid(): boolean {
        return Object.values(this.getValidity()).every(x => x === false);
    }

    public validateGridDimensions(): boolean {
        this.invalidGridDimensions = false;
        if (
            typeof this.wafermap.gridMinX === 'undefined'
            && typeof this.wafermap.gridMaxX === 'undefined'
            && typeof this.wafermap.gridMinY === 'undefined'
            && typeof this.wafermap.gridMaxY === 'undefined'
        ) {
            this.invalidGridDimensions = false;
        } else if (
            typeof this.wafermap.gridMinX !== 'number'
            || typeof this.wafermap.gridMaxX !== 'number'
            || typeof this.wafermap.gridMinY !== 'number'
            || typeof this.wafermap.gridMaxY !== 'number'
            || this.wafermap.gridMaxX < this.wafermap.gridMinX
            || this.wafermap.gridMaxY < this.wafermap.gridMinY
        ) {
            this.invalidGridDimensions = true;
        }
        return !this.invalidGridDimensions;
    }
}

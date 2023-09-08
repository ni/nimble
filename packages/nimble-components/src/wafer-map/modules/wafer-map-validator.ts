import type { WaferMap } from '..';
import type { WaferMapValidity } from '../types';

/**
 * Helper class for the nimble-table to validate that the table's configuration
 * is valid and report which aspects of the configuration are valid or invalid.
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
            !this.wafermap.gridMinX
            && !this.wafermap.gridMaxX
            && !this.wafermap.gridMinY
            && !this.wafermap.gridMaxY
        ) {
            this.invalidGridDimensions = false;
        } else if (
            !this.wafermap.gridMinX
            || !this.wafermap.gridMaxX
            || !this.wafermap.gridMinY
            || !this.wafermap.gridMaxY
            || this.wafermap.gridMaxX < this.wafermap.gridMinX
            || this.wafermap.gridMaxY < this.wafermap.gridMinY
        ) {
            this.invalidGridDimensions = true;
        }
        return !this.invalidGridDimensions;
    }
}

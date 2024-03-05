import { DataType } from 'apache-arrow';
import type { WaferMap } from '..';
import type { WaferMapValidity } from '../types';

/**
 * Helper class for the nimble-wafer-map to validate that the wafer maps's grid dimensions
 * configuration is valid and report which aspects of the configuration are valid or invalid.
 */
export class WaferMapValidator {
    private invalidGridDimensions = false;
    private invalidDiesTableSchema = false;

    public constructor(private readonly wafermap: WaferMap) {}
    public getValidity(): WaferMapValidity {
        return {
            invalidGridDimensions: this.invalidGridDimensions,
            invalidDiesTableSchema: this.invalidDiesTableSchema
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

    public validateDiesTableSchema(): boolean {
        this.invalidDiesTableSchema = false;
        if (this.wafermap.diesTable === undefined) {
            this.invalidDiesTableSchema = false;
        } else if (
            this.wafermap.diesTable.numCols < 3
            || this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'colIndex'
            ) === -1
            || this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'rowIndex'
            ) === -1
            || this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'value'
            ) === -1
        ) {
            this.invalidDiesTableSchema = true;
        } else {
            const colIndex = this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'colIndex'
            );
            const rowIndex = this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'rowIndex'
            );
            const value = this.wafermap.diesTable.schema.fields.findIndex(
                f => f.name === 'value'
            );
            if (
                !DataType.isInt(this.wafermap.diesTable.schema.fields[colIndex]!.type)
                || !DataType.isInt(this.wafermap.diesTable.schema.fields[rowIndex]!.type)
                || !DataType.isFloat(this.wafermap.diesTable.schema.fields[value]!.type)
            ) {
                this.invalidDiesTableSchema = true;
            }
        }
        return !this.invalidDiesTableSchema;
    }
}

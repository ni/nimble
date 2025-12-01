import { DataType, Precision } from 'apache-arrow';
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
            this.wafermap.gridMinX === undefined
            && this.wafermap.gridMaxX === undefined
            && this.wafermap.gridMinY === undefined
            && this.wafermap.gridMaxY === undefined
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
        } else {
            const fields = this.wafermap.diesTable.schema.fields;
            const colField = fields.find(field => field.name === 'colIndex');
            const rowField = fields.find(field => field.name === 'rowIndex');
            const valueField = fields.find(field => field.name === 'value');
            if (
                !colField
                || !rowField
                || !valueField
                || !DataType.isInt(colField.type)
                || colField.type.bitWidth !== 32
                || !DataType.isInt(rowField.type)
                || rowField.type.bitWidth !== 32
                || !DataType.isFloat(valueField.type)
                || valueField.type.precision !== Precision.DOUBLE
            ) {
                this.invalidDiesTableSchema = true;
            }
        }
        return !this.invalidDiesTableSchema;
    }
}

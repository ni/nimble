/* eslint-disable max-classes-per-file */
import { nullableNumberConverter } from '@microsoft/fast-element';
import { Icon } from '../../../icon-base';
import { ColumnValidator } from '../../base/models/column-validator';
import type { Mapping } from '../mappings';
import { MappingIcon } from '../mappings/icon';

export const mappingColumnValidityFlagNames = [
    'invalidMappingKeyValueForType',
    'multipleDefaultMappings',
    'unsupportedMappingType',
    'duplicateMappingKey',
    'missingKeyValue'
] as const;

/**
 * Helper to share logic between the mapping and icon column validators
 */
class TableColumnMappingValidationHelper {
    public static invalidMappingKeyValueForType(
        keys: unknown[],
        keyType: string
    ): boolean {
        let invalid = false;
        if (keyType === 'number') {
            invalid = keys.some(
                x => x !== undefined
                    && nullableNumberConverter.fromView(x) === null
            );
        } else if (keyType === 'boolean') {
            // never invalid
        } else {
            invalid = keys.some(x => x === null);
        }

        return invalid;
    }

    public static multipleDefaultMappings(mappings: Mapping[]): boolean {
        return mappings.filter(x => x.defaultMapping).length > 1;
    }

    public static unsupportedMappingType(
        mappings: Mapping[],
        allowedMappingTypes: (typeof Mapping)[]
    ): boolean {
        return mappings.some(
            x => allowedMappingTypes.filter(y => x instanceof y).length === 0
        );
    }

    public static duplicateMappingKey(keys: unknown[]): boolean {
        return new Set(keys).size !== keys.length;
    }

    public static missingKeyValue(mappings: Mapping[]): boolean {
        return (
            mappings.filter(x => x.key === undefined && !x.defaultMapping)
                .length > 0
        );
    }
}

/**
 * Validator for TableColumnMapping
 */
export class TableColumnMappingValidator extends ColumnValidator<
    typeof mappingColumnValidityFlagNames
> {
    public validateKeyValuesForType(keys: unknown[], keyType: string): void {
        const invalid = TableColumnMappingValidationHelper.invalidMappingKeyValueForType(
            keys,
            keyType
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    public validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.multipleDefaultMappings(
            mappings
        );
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    public validateMappingTypes(
        mappings: Mapping[],
        allowedMappingTypes: (typeof Mapping)[]
    ): void {
        const invalid = TableColumnMappingValidationHelper.unsupportedMappingType(
            mappings,
            allowedMappingTypes
        );
        this.setConditionValue('unsupportedMappingType', invalid);
    }

    public validateUniqueKeys(keys: unknown[]): void {
        const invalid = TableColumnMappingValidationHelper.duplicateMappingKey(keys);
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    public validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.missingKeyValue(mappings);
        this.setConditionValue('missingKeyValue', invalid);
    }
}

export const iconColumnValidityFlagNames = [
    ...mappingColumnValidityFlagNames,
    'invalidIconName'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends ColumnValidator<
    typeof iconColumnValidityFlagNames
> {
    public validateKeyValuesForType(keys: unknown[], keyType: string): void {
        const invalid = TableColumnMappingValidationHelper.invalidMappingKeyValueForType(
            keys,
            keyType
        );
        this.setConditionValue('invalidMappingKeyValueForType', invalid);
    }

    public validateAtMostOneDefaultMapping(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.multipleDefaultMappings(
            mappings
        );
        this.setConditionValue('multipleDefaultMappings', invalid);
    }

    public validateMappingTypes(
        mappings: Mapping[],
        allowedMappingTypes: (typeof Mapping)[]
    ): void {
        const invalid = TableColumnMappingValidationHelper.unsupportedMappingType(
            mappings,
            allowedMappingTypes
        );
        this.setConditionValue('unsupportedMappingType', invalid);
    }

    public validateUniqueKeys(keys: unknown[]): void {
        const invalid = TableColumnMappingValidationHelper.duplicateMappingKey(keys);
        this.setConditionValue('duplicateMappingKey', invalid);
    }

    public validateNoMissingKeys(mappings: Mapping[]): void {
        const invalid = TableColumnMappingValidationHelper.missingKeyValue(mappings);
        this.setConditionValue('missingKeyValue', invalid);
    }

    public validateIconNames(mappings: Mapping[]): void {
        const invalid = mappings
            .filter(x => x instanceof MappingIcon)
            .map(x => (x as MappingIcon).icon)
            .some(x => !x || !this.iconIsValid(x));
        this.setConditionValue('invalidIconName', invalid);
    }

    private iconIsValid(name: string): boolean {
        return document.createElement(name) instanceof Icon;
    }
}

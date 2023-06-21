import { Icon } from '../../../icon-base';
import type { Mapping } from '../../../mapping/base';
import { MappingIcon } from '../../../mapping/icon';
import type { ColumnInternals } from '../../base/models/column-internals';
import { TableColumnEnumBaseValidator, enumBaseValidityFlagNames } from '../../enum-base/models/table-column-enum-base-validator';

const iconValidityFlagNames = [
    ...enumBaseValidityFlagNames,
    'invalidIconName'
] as const;

/**
 * Validator for TableColumnIcon
 */
export class TableColumnIconValidator extends TableColumnEnumBaseValidator<
    typeof iconValidityFlagNames
> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, iconValidityFlagNames);
    }

    public validateIconNames(mappings: Mapping[]): void {
        const invalid = mappings
            .filter(x => x instanceof MappingIcon)
            .map(x => (x as MappingIcon).icon)
            .some(x => !x || !this.iconIsValid(x));
        this.setConditionValue('invalidIconName', invalid);
    }

    private iconIsValid(name: string): boolean {
        // TODO don't construct, do customElements.get, also can happen async
        return document.createElement(name) instanceof Icon;
    }
}

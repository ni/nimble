import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type GroupableTableColumn = Pick<
TableColumn,
'internalGroupingDisabled' | 'internalGroupIndex'
>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GroupableTableColumnConstructor = abstract new (...args: any[]) => GroupableTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinGroupableColumnAPI<
    TBase extends GroupableTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow grouping
     * by the values in that column.
     */
    abstract class GroupableColumn extends base {
        public groupingDisabled = false;

        public groupIndex?: number | null = null;

        public groupingDisabledChanged(): void {
            this.internalGroupingDisabled = this.groupingDisabled;
        }

        public groupIndexChanged(): void {
            if (typeof this.groupIndex === 'number') {
                this.internalGroupIndex = this.groupIndex;
            } else {
                this.internalGroupIndex = undefined;
            }
        }
    }
    attr({ attribute: 'grouping-disabled', mode: 'boolean' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        GroupableColumn.prototype,
        'groupingDisabled'
    );
    attr({ attribute: 'group-index', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        GroupableColumn.prototype,
        'groupIndex'
    );

    return GroupableColumn;
}

import {
    attr,
    nullableNumberConverter,
    observable
} from '@microsoft/fast-element';
import type { TableColumn } from '../base';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type GroupableTableColumn = Pick<
TableColumn,
'internalIsGroupable' | 'internalGroupIndex' | 'internalGroupHeaderViewTag'
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
        public disableGrouping?: boolean;

        public groupIndex?: number | null = null;

        public abstract groupHeaderViewTag: string;

        public isDisableGroupingChanged(): void {
            this.internalIsGroupable = !this.disableGrouping;
        }

        public groupIndexChanged(): void {
            if (typeof this.groupIndex === 'number') {
                this.internalGroupIndex = this.groupIndex;
            } else {
                this.internalGroupIndex = undefined;
            }
        }

        public groupHeaderViewTagChanged(): void {
            this.internalGroupHeaderViewTag = this.groupHeaderViewTag;
        }
    }
    attr({ attribute: 'disable-grouping', mode: 'boolean' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        GroupableColumn.prototype,
        'disableGrouping'
    );
    attr({ attribute: 'group-index', converter: nullableNumberConverter })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        GroupableColumn.prototype,
        'groupIndex'
    );
    observable(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        GroupableColumn.prototype,
        'groupHeaderViewTag'
    );

    return GroupableColumn;
}

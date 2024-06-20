import { attr } from '@microsoft/fast-element';
import type { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type CustomSortOrderTableColumn = Pick<TableColumn, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomSortOrderTableColumnConstructor = abstract new (...args: any[]) => CustomSortOrderTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinCustomSortOrderColumnAPI<
    TBase extends CustomSortOrderTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow sorting
     * by a field other than the default for that column.
     */
    abstract class CustomSortOrderColumn extends base {
        public sortByFieldName?: string;

        /** @internal */
        public sortByFieldNameChanged(): void {
            this.updateOperandDataRecordFieldName();
        }

        /** @internal */
        public updateOperandDataRecordFieldName(): void {
            if (typeof this.sortByFieldName === 'string') {
                this.columnInternals.operandDataRecordFieldName = this.sortByFieldName;
                this.columnInternals.sortOperation = TableColumnSortOperation.basic;
            } else {
                this.columnInternals.operandDataRecordFieldName = this.getDefaultSortFieldName();
                this.columnInternals.sortOperation = this.getDefaultSortOperation();
            }
        }

        /** @internal */
        public abstract getDefaultSortFieldName(): string | undefined;

        /** @internal */
        public abstract getDefaultSortOperation(): TableColumnSortOperation;
    }
    attr({ attribute: 'sort-by-field-name' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        CustomSortOrderColumn.prototype,
        'sortByFieldName'
    );

    return CustomSortOrderColumn;
}

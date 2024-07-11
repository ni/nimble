import { Notifier, Observable, attr } from '@microsoft/fast-element';
import type { TableColumn } from '../base';
import { TableColumnSortOperation } from '../base/types';
import type { ColumnValidator } from '../base/models/column-validator';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type CustomSortOrderTableColumn<
    TColumnValidator extends ColumnValidator<['invalidCustomSortWithGrouping']>
> = Pick<TableColumn<unknown, TColumnValidator>, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CustomSortOrderTableColumnConstructor<TColumnValidator extends ColumnValidator<['invalidCustomSortWithGrouping']>> = abstract new (...args: any[]) => CustomSortOrderTableColumn<TColumnValidator>;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinCustomSortOrderColumnAPI<
    TBase extends CustomSortOrderTableColumnConstructor<TColumnValidator>,
    TColumnValidator extends ColumnValidator<['invalidCustomSortWithGrouping']>
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow sorting
     * by a field other than the default for that column.
     */
    abstract class CustomSortOrderColumn extends base {
        public sortByFieldName?: string;

        /** @internal */
        public notifier?: Notifier;

        public getResolvedOperandDataRecordFieldName(initialOperandFieldName: string | undefined): string | undefined {
            return typeof this.sortByFieldName === 'string' ? this.sortByFieldName : initialOperandFieldName;
        }

        public getResolvedSortOperation(initialSortOperation: TableColumnSortOperation): TableColumnSortOperation {
            return typeof this.sortByFieldName === 'string' ? TableColumnSortOperation.basic : initialSortOperation;
        }

        /** @internal */
        public sortByFieldNameChanged(): void {
            this.handleSortByFieldNameChange();
            this.updateCustomColumnSortingValidity();

            if (typeof this.sortByFieldName === 'string' && !this.notifier) {
                this.notifier = Observable.getNotifier(this.columnInternals);
                this.notifier.subscribe(this);
                this.updateCustomColumnSortingValidity();
            } else {
                this.notifier?.unsubscribe(this);
                this.notifier = undefined;
                this.updateCustomColumnSortingValidity();
            }
        }

        public abstract handleSortByFieldNameChange(): void;

        /** @internal */
        public handleChange(_source: unknown, args: unknown): void {
            if (args === 'groupingDisabled') {
                this.updateCustomColumnSortingValidity();
            }
        }

        /** @internal */
        public updateCustomColumnSortingValidity(): void {
            const hasCustomColumnSorting = typeof this.sortByFieldName === 'string';
            const isGroupingEnabled = !this.columnInternals.groupingDisabled;
            const isValid = !isGroupingEnabled || !hasCustomColumnSorting;
            if (isValid) {
                this.columnInternals.validator.untrack(
                    'invalidCustomSortWithGrouping'
                );
            } else {
                this.columnInternals.validator.track(
                    'invalidCustomSortWithGrouping'
                );
            }
        }
    }

    attr({ attribute: 'sort-by-field-name' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        CustomSortOrderColumn.prototype,
        'sortByFieldName'
    );

    return CustomSortOrderColumn;
}

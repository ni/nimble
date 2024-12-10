import { attr } from '@microsoft/fast-element';
import type { TableColumn } from '../base';

// Pick just the relevant properties the mixin depends on (typescript complains if the mixin declares private / protected base exports)
type EditableTableColumn = Pick<TableColumn, 'columnInternals'>;
// prettier-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EditableTableColumnConstructor = abstract new (...args: any[]) => EditableTableColumn;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinEditableColumnAPI<
    TBase extends EditableTableColumnConstructor
>(base: TBase) {
    /**
     * The Mixin that provides a concrete column with the API to allow grouping
     * by the values in that column.
     */
    abstract class EditableColumn extends base {
        public editable = false;

        public abstract editableChanged(): void;
    }
    attr({ attribute: 'editable', mode: 'boolean' })(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        EditableColumn.prototype,
        'editable'
    );

    return EditableColumn;
}

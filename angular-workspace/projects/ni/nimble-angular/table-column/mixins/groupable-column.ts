import { Directive, Input } from '@angular/core';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import type { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import type { NimbleTableColumnBaseDirective } from '../nimble-table-column-base.directive';

type GroupableColumn = TableColumn & {
    groupingDisabled: boolean,
    groupIndex?: number | null
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GroupableColumnDirectiveConstructor<T extends GroupableColumn> = abstract new (...args: any[]) => NimbleTableColumnBaseDirective<T>;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinGroupableColumnAPI<TBase extends GroupableColumnDirectiveConstructor<GroupableColumn>>(base: TBase) {
    /**
     * The Mixin that provides a concrete column directive with the API to allow grouping
     * by the values in that column.
     */
    @Directive()
    abstract class GroupableColumnDirective extends base {
        public get groupIndex(): number | null | undefined {
            return this.elementRef.nativeElement.groupIndex;
        }

        // Renaming because property should have camel casing, but attribute should not
        // eslint-disable-next-line @angular-eslint/no-input-rename
        @Input('group-index') public set groupIndex(value: NumberValueOrAttribute | null | undefined) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'groupIndex', toNullableNumberProperty(value));
        }

        public get groupingDisabled(): boolean {
            return this.elementRef.nativeElement.groupingDisabled;
        }

        // Renaming because property should have camel casing, but attribute should not
        // eslint-disable-next-line @angular-eslint/no-input-rename
        @Input('grouping-disabled') public set groupingDisabled(value: BooleanValueOrAttribute) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'groupingDisabled', toBooleanProperty(value));
        }
    }
    return GroupableColumnDirective;
}
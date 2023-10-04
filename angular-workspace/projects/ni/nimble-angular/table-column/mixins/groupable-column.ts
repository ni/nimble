/* eslint-disable max-classes-per-file */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';

export interface GroupableColumn {
    groupingDisabled: boolean;
    groupIndex?: number | null;
}

/**
 * TODO
 */
export abstract class GroupableColumnDirectiveBase<T extends GroupableColumn> {
    public renderer: Renderer2;
    public elementRef: ElementRef<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GroupableColumnDirectiveBaseConstructor<T extends GroupableColumn> = abstract new (...args: any[]) => GroupableColumnDirectiveBase<T>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinGroupableColumnAPI<TBase extends GroupableColumnDirectiveBaseConstructor<GroupableColumn>>(base: TBase) {
    /**
     * TODO
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
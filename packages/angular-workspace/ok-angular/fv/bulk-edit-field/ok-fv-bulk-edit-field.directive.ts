import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvBulkEditField } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import { BulkEditFieldStatus, fvBulkEditFieldTag } from '@ni/ok-components/dist/esm/fv/bulk-edit-field';
import type { BulkEditFieldStatus as BulkEditFieldStatusType } from '@ni/ok-components/dist/esm/fv/bulk-edit-field/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvBulkEditField };
export { BulkEditFieldStatus, fvBulkEditFieldTag };
export type { BulkEditFieldStatusType };

/**
 *
 */
/**
 * Angular bindings for the bulk-edit field shell.
 */
@Directive({
    selector: 'ok-fv-bulk-edit-field',
    standalone: false
})
export class OkFvBulkEditFieldDirective {
    @Output() public resetEvent = new EventEmitter<Event>();
    @Output() public clearEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvBulkEditField>,
        private readonly renderer: Renderer2
    ) {}

    public get label(): string {
        return this.elementRef.nativeElement.label;
    }

    @Input() public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get status(): BulkEditFieldStatusType {
        return this.elementRef.nativeElement.status;
    }

    @Input() public set status(value: BulkEditFieldStatusType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'status', value);
    }

    public get resetDisabled(): boolean {
        return this.elementRef.nativeElement.resetDisabled;
    }

    @Input('reset-disabled') public set resetDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'resetDisabled', toBooleanProperty(value));
    }

    public get clearDisabled(): boolean {
        return this.elementRef.nativeElement.clearDisabled;
    }

    @Input('clear-disabled') public set clearDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'clearDisabled', toBooleanProperty(value));
    }

    @HostListener('reset', ['$event'])
    public onReset(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.resetEvent.emit(event);
        }
    }

    @HostListener('clear', ['$event'])
    public onClear(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.clearEvent.emit(event);
        }
    }
}

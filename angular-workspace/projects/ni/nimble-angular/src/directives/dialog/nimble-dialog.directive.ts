import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { Dialog } from '@ni/nimble-components/dist/esm/dialog';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Dialog };

/**
 * Directive to provide Angular integration for the dialog element.
 */
@Directive({
    selector: 'nimble-dialog'
})
export class NimbleDialogDirective {
    public get preventDismiss(): boolean {
        return this.elementRef.nativeElement.preventDismiss;
    }

    // preventDismiss property intentionally maps to the prevent-dismiss attribute
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('prevent-dismiss') public set preventDismiss(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'preventDismiss', toBooleanProperty(value));
    }

    @Output() public dialogClose = new EventEmitter<void>();
    @Output() public dialogCancel = new EventEmitter<void>();

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Dialog>) {}

    @HostListener('close')
    public onClose(): void {
        this.dialogClose.emit();
    }

    @HostListener('cancel')
    public onCancel(): void {
        this.dialogCancel.emit();
    }
}
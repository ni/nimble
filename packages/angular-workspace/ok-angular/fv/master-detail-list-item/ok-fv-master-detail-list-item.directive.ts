import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvMasterDetailListItem } from '@ni/ok-components/dist/esm/fv/master-detail-list-item';
import { fvMasterDetailListItemTag } from '@ni/ok-components/dist/esm/fv/master-detail-list-item';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvMasterDetailListItem };
export { fvMasterDetailListItemTag };

/**
 * Directive to provide Angular integration for the master-detail list item.
 */
@Directive({
    selector: 'ok-fv-master-detail-list-item',
    standalone: false
})
export class OkFvMasterDetailListItemDirective {
    public get titleText(): string {
        return this.elementRef.nativeElement.titleText;
    }

    @Input('title-text')
    public set titleText(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'titleText', value);
    }

    public get subtitle(): string {
        return this.elementRef.nativeElement.subtitle;
    }

    @Input()
    public set subtitle(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'subtitle', value);
    }

    public get value(): string {
        return this.elementRef.nativeElement.value;
    }

    @Input()
    public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public get compact(): boolean {
        return this.elementRef.nativeElement.compact;
    }

    @Input()
    public set compact(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'compact', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input()
    public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }

    public get statusColor(): string {
        return this.elementRef.nativeElement.statusColor;
    }

    @Input('status-color')
    public set statusColor(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'statusColor', value);
    }

    public get statusLabel(): string {
        return this.elementRef.nativeElement.statusLabel;
    }

    @Input('status-label')
    public set statusLabel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'statusLabel', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvMasterDetailListItem>,
        private readonly renderer: Renderer2
    ) {}
}
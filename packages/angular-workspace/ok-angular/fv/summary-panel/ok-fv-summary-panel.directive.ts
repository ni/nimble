import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvSummaryPanel } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { fvSummaryPanelTag } from '@ni/ok-components/dist/esm/fv/summary-panel';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSummaryPanel };
export { fvSummaryPanelTag };

/**
 * Directive to provide Angular integration for the summary panel.
 */
@Directive({
    selector: 'ok-fv-summary-panel',
    standalone: false
})
export class OkFvSummaryPanelDirective {
    public get showEditItemsButton(): boolean {
        return this.elementRef.nativeElement.showEditItemsButton;
    }

    @Input()
    public set showEditItemsButton(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'showEditItemsButton', toBooleanProperty(value));
    }

    public get legacyStyle(): boolean {
        return this.elementRef.nativeElement.legacyStyle;
    }

    @Input()
    public set legacyStyle(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'legacyStyle', toBooleanProperty(value));
    }

    public get editItemsButtonLabel(): string {
        return this.elementRef.nativeElement.editItemsButtonLabel;
    }

    @Input()
    public set editItemsButtonLabel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'editItemsButtonLabel', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvSummaryPanel>,
        private readonly renderer: Renderer2
    ) {}
}

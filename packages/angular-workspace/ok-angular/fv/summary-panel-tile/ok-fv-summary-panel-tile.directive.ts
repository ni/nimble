import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvSummaryPanelTile } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import { fvSummaryPanelTileTag } from '@ni/ok-components/dist/esm/fv/summary-panel-tile';
import { FvSummaryPanelTileTextPosition } from '@ni/ok-components/dist/esm/fv/summary-panel-tile/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSummaryPanelTile };
export { fvSummaryPanelTileTag };
export { FvSummaryPanelTileTextPosition };

/**
 * Directive to provide Angular integration for the summary panel tile.
 */
@Directive({
    selector: 'ok-fv-summary-panel-tile',
    standalone: false
})
export class OkFvSummaryPanelTileDirective {
    public get count(): string {
        return this.elementRef.nativeElement.count;
    }

    @Input()
    public set count(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'count', value);
    }

    public get label(): string {
        return this.elementRef.nativeElement.label;
    }

    @Input()
    public set label(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'label', value);
    }

    public get legacyStyle(): boolean {
        return this.elementRef.nativeElement.legacyStyle;
    }

    @Input()
    public set legacyStyle(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'legacyStyle', toBooleanProperty(value));
    }

    public get selected(): boolean {
        return this.elementRef.nativeElement.selected;
    }

    @Input()
    public set selected(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selected', toBooleanProperty(value));
    }

    public get textPosition(): FvSummaryPanelTileTextPosition {
        return this.elementRef.nativeElement.textPosition;
    }

    @Input()
    public set textPosition(value: FvSummaryPanelTileTextPosition) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'textPosition', value);
    }

    public constructor(
        private readonly elementRef: ElementRef<FvSummaryPanelTile>,
        private readonly renderer: Renderer2
    ) {}
}

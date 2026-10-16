import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvSplitLayout } from '@ni/ok-components/dist/esm/fv/split-layout';
import { fvSplitLayoutTag } from '@ni/ok-components/dist/esm/fv/split-layout';
import { type BooleanValueOrAttribute, type NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSplitLayout };
export { fvSplitLayoutTag };

/**
 *
 */
/**
 * Angular bindings for the split-pane layout.
 */
@Directive({
    selector: 'ok-fv-split-layout',
    standalone: false
})
export class OkFvSplitLayoutDirective {
    @Output() public inputEvent = new EventEmitter<Event>();
    @Output() public changeEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvSplitLayout>,
        private readonly renderer: Renderer2
    ) {}

    public get position(): number {
        return this.elementRef.nativeElement.position;
    }

    @Input() public set position(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'position', toNumberProperty(value));
    }

    public get min(): number {
        return this.elementRef.nativeElement.min;
    }

    @Input() public set min(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'min', toNumberProperty(value));
    }

    public get max(): number {
        return this.elementRef.nativeElement.max;
    }

    @Input() public set max(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'max', toNumberProperty(value));
    }

    public get minSecondaryPixels(): number {
        return this.elementRef.nativeElement.minSecondaryPixels;
    }

    @Input('min-secondary-pixels') public set minSecondaryPixels(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minSecondaryPixels', toNumberProperty(value));
    }

    public get collapsed(): boolean {
        return this.elementRef.nativeElement.collapsed;
    }

    @Input() public set collapsed(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'collapsed', toBooleanProperty(value));
    }

    public get step(): number {
        return this.elementRef.nativeElement.step;
    }

    @Input() public set step(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'step', toNumberProperty(value));
    }

    public get primaryPaneId(): string {
        return this.elementRef.nativeElement.primaryPaneId;
    }

    @Input('primary-pane-id') public set primaryPaneId(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'primaryPaneId', value);
    }

    public get secondaryPaneId(): string {
        return this.elementRef.nativeElement.secondaryPaneId;
    }

    @Input('secondary-pane-id') public set secondaryPaneId(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'secondaryPaneId', value);
    }

    @HostListener('input', ['$event'])
    public onInput(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.inputEvent.emit(event);
        }
    }

    @HostListener('change', ['$event'])
    public onChange(event: Event): void {
        if (event.target === this.elementRef.nativeElement) {
            this.changeEvent.emit(event);
        }
    }
}

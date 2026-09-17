import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import type { FvSplitter } from '@ni/ok-components/dist/esm/fv/splitter';
import { fvSplitterTag } from '@ni/ok-components/dist/esm/fv/splitter';
import { type NumberValueOrAttribute, toNumberProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvSplitter };
export { fvSplitterTag };

/**
 * Directive to provide Angular integration for the FV splitter.
 */
@Directive({
    selector: 'ok-fv-splitter',
    standalone: false
})
export class OkFvSplitterDirective {
    public get ariaLabel(): string {
        return this.elementRef.nativeElement.ariaLabel;
    }

    @Input('aria-label')
    public set ariaLabel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabel', value);
    }

    public get ariaLabelledby(): string | undefined {
        return this.elementRef.nativeElement.ariaLabelledby;
    }

    @Input('aria-labelledby')
    public set ariaLabelledby(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ariaLabelledby', value);
    }

    public get ariaControls(): string | undefined {
        return this.elementRef.nativeElement.ariaControls;
    }

    @Input('aria-controls')
    public set ariaControls(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ariaControls', value);
    }

    public get position(): number {
        return this.elementRef.nativeElement.position;
    }

    @Input()
    public set position(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'position', toNumberProperty(value));
    }

    public get min(): number {
        return this.elementRef.nativeElement.min;
    }

    @Input()
    public set min(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'min', toNumberProperty(value));
    }

    public get max(): number {
        return this.elementRef.nativeElement.max;
    }

    @Input()
    public set max(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'max', toNumberProperty(value));
    }

    public get step(): number {
        return this.elementRef.nativeElement.step;
    }

    @Input()
    public set step(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'step', toNumberProperty(value));
    }

    @Output()
    public inputEvent = new EventEmitter<Event>();

    @Output()
    public changeEvent = new EventEmitter<Event>();

    public constructor(
        private readonly elementRef: ElementRef<FvSplitter>,
        private readonly renderer: Renderer2
    ) {}

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
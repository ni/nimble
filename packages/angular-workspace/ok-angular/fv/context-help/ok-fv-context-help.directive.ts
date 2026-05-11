import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { FvContextHelp } from '@ni/ok-components/dist/esm/fv/context-help';
import { fvContextHelpTag } from '@ni/ok-components/dist/esm/fv/context-help';
import type { FvContextHelpSeverity } from '@ni/ok-components/dist/esm/fv/context-help/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvContextHelp };
export { fvContextHelpTag };
export type { FvContextHelpSeverity };

/**
 * Directive to provide Angular integration for the context help.
 */
@Directive({
    selector: 'ok-fv-context-help',
    standalone: false
})
export class OkFvContextHelpDirective {
    public get text(): string {
        return this.elementRef.nativeElement.text;
    }

    @Input()
    public set text(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'text', value);
    }

    public get triggerLabel(): string {
        return this.elementRef.nativeElement.triggerLabel;
    }

    @Input()
    public set triggerLabel(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'triggerLabel', value);
    }

    public get severity(): FvContextHelpSeverity {
        return this.elementRef.nativeElement.severity;
    }

    @Input()
    public set severity(value: FvContextHelpSeverity) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'severity', value);
    }

    public get iconVisible(): boolean {
        return this.elementRef.nativeElement.iconVisible;
    }

    @Input()
    public set iconVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'iconVisible', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<FvContextHelp>,
        private readonly renderer: Renderer2
    ) {}
}

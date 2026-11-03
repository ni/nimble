import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { LabelProviderChat } from '@ni/spright-components/dist/esm/label-provider/chat';

export type { LabelProviderChat };

/**
 * Directive to provide Angular integration for the Spright chat label provider.
 * To use the Spright-provided strings declared via $localize, instead use SprightLabelProviderChatWithDefaultsDirective.
 */
@Directive({
    selector: 'spright-label-provider-chat',
    standalone: false
})
export class SprightLabelProviderChatDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderChat>) {
    }

    public get send(): string | undefined {
        return this.elementRef.nativeElement.send;
    }

    @Input() public set send(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'send', value);
    }

    public get stop(): string | undefined {
        return this.elementRef.nativeElement.stop;
    }

    @Input() public set stop(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'stop', value);
    }
}
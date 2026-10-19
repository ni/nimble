import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { LabelProviderChat } from '@ni/spright-components/dist/esm/label-provider/chat';

/**
 * Directive for spright-label-provider-chat which initializes all labels with $localize-tagged strings.
 */
@Directive({
    selector: 'spright-label-provider-chat[withDefaults]',
    standalone: false
})
export class SprightLabelProviderChatWithDefaultsDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<LabelProviderChat>) {
        this.elementRef.nativeElement.send = $localize`:Spright chat - send|:Send`;
        this.elementRef.nativeElement.stop = $localize`:Spright chat - stop|:Stop`;
    }
}
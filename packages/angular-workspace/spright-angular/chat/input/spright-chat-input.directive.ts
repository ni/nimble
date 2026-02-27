import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { BooleanValueOrAttribute } from '@ni/nimble-angular/internal-utilities';
import { type ChatInput, chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import type { ChatInputSendEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';
import { toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { ChatInput };
export type { ChatInputSendEventDetail };
export { chatInputTag };

/**
 * Directive to provide Angular integration for the chat input.
 */
@Directive({
    selector: 'spright-chat-input',
    standalone: false
})
export class SprightChatInputDirective {
    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get sendButtonLabel(): string | undefined {
        return this.elementRef.nativeElement.sendButtonLabel;
    }

    @Input('send-button-label') public set sendButtonLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sendButtonLabel', value);
    }

    public get stopButtonLabel(): string | undefined {
        return this.elementRef.nativeElement.stopButtonLabel;
    }

    @Input('stop-button-label') public set stopButtonLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'stopButtonLabel', value);
    }

    public get processing(): boolean | undefined {
        return this.elementRef.nativeElement.processing;
    }

    @Input('processing') public set processing(value: boolean | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'processing', value);
    }

    public get sendDisabled(): boolean | undefined {
        return this.elementRef.nativeElement.sendDisabled;
    }

    @Input('send-disabled') public set sendDisabled(value: boolean | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sendDisabled', value);
    }

    public get maxLength(): number | undefined {
        return this.elementRef.nativeElement.maxLength;
    }

    @Input('maxlength') public set maxLength(value: number | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'maxLength', value);
    }

    public get value(): string | undefined {
        return this.elementRef.nativeElement.value;
    }

    @Input() public set value(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatInput>) {}
}

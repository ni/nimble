import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ChatInput, chatInputTag } from '@ni/spright-components/dist/esm/chat/input';
import type { ChatInputSendEventDetail, ChatInputStopEventDetail } from '@ni/spright-components/dist/esm/chat/input/types';

export type { ChatInput };
export type { ChatInputSendEventDetail };
export type { ChatInputStopEventDetail };
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

    public get processing(): boolean {
        return this.elementRef.nativeElement.processing;
    }

    @Input('processing') public set processing(value: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'processing', value);
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

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatInput>) {}
}

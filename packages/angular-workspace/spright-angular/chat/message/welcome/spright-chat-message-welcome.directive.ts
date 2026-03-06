import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ChatMessageWelcome, chatMessageWelcomeTag } from '@ni/spright-components/dist/esm/chat/message/welcome';

export type { ChatMessageWelcome };
export { chatMessageWelcomeTag };

/**
 * Directive to provide Angular integration for the chat welcome message.
 */
@Directive({
    selector: 'spright-chat-message-welcome',
    standalone: false
})
export class SprightChatMessageWelcomeDirective {
    public get title(): string | undefined {
        return this.elementRef.nativeElement.welcomeTitle;
    }

    @Input() public set title(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'welcomeTitle', value);
    }

    public get subtitle(): string | undefined {
        return this.elementRef.nativeElement.subtitle;
    }

    @Input() public set subtitle(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'subtitle', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ChatMessageWelcome>) {}
}
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { RichTextMentionValidity } from '@ni/nimble-components/dist/esm/rich-text-mention/base/models/mention-validator';
import type { MentionUpdateEventDetail } from '@ni/nimble-components/dist/esm/rich-text-mention/base/types';
import type { RichTextMention } from '@ni/nimble-components/dist/esm/rich-text-mention/base';

export { RichTextMentionValidity };
export type { MentionUpdateEventDetail };

/**
 * Base class for rich text mention directives
 */
@Directive()
export class NimbleRichTextMentionDirective<T extends RichTextMention> {
    @Input() public set pattern(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'pattern', value);
    }

    public get pattern(): string | undefined {
        return this.elementRef.nativeElement.pattern;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<T>) { }

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }

    public getMentionedHrefs(): string[] {
        return this.elementRef.nativeElement.getMentionedHrefs();
    }

    public get validity(): RichTextMentionValidity {
        return this.elementRef.nativeElement.validity;
    }
}

import type { RichTextEditor } from '..';
import type { ToggleButton } from '../../toggle-button';

/**
 * Page object for the `nimble-rich-text-editor` component.
 */
export class RichTextEditorPageObject {
    public constructor(
        private readonly richTextEditorElement: RichTextEditor
    ) {}

    public getEditorSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('.editor');
    }

    public getTiptapEditor(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            '.ProseMirror'
        );
    }

    public getFooterSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            '.footer-section'
        );
    }

    public getSlotElement(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('slot');
    }

    public getFormattingButton(
        className: string
    ): ToggleButton | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            `.${className}`
        );
    }

    public getEditorLastChildElement(): Element | null | undefined {
        let lastElement = this.getTiptapEditor()?.lastElementChild;

        while (lastElement?.lastElementChild) {
            lastElement = lastElement?.lastElementChild;
        }
        return lastElement;
    }

    public getEditorFirstChildElement(): Element | null | undefined {
        return this.getTiptapEditor()?.firstElementChild;
    }

    public getEditorTagNames(): string[] {
        return Array.from(this.getTiptapEditor()!.querySelectorAll('*')).map(
            el => el.tagName
        );
    }

    public getEditorLeafContents(): string[] {
        return Array.from(this.getTiptapEditor()!.querySelectorAll('*'))
            .filter((el, _) => {
                return el.children.length === 0;
            })
            .map(el => el.textContent || '');
    }
}

import { keySpace, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import type { RichTextEditor } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { ToggleButton } from '../../../toggle-button';
import type { ToolbarButton } from './types';

/**
 * Page object for the `nimble-rich-text-editor` component.
 */
export class RichTextEditorPageObject {
    public constructor(
        private readonly richTextEditorElement: RichTextEditor
    ) {}

    public editorSectionHasChildNodes(): boolean {
        const editorSection = this.getEditorSection();
        return editorSection!.hasChildNodes();
    }

    public getEditorSectionFirstElementChildClassName(): string {
        const editorSection = this.getEditorSection();
        return editorSection!.firstElementChild!.className;
    }

    public async clickEditorShortcutKeys(
        shortcutKey: string,
        isShiftKey: boolean
    ): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: shortcutKey,
            ctrlKey: true,
            shiftKey: isShiftKey,
            bubbles: true,
            cancelable: true
        });
        editor!.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressEnterKeyInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: keyEnter,
            bubbles: true,
            cancelable: true
        });
        editor!.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressTabKeyInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: keyTab,
            bubbles: true,
            cancelable: true
        });
        editor!.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressShiftTabKeysInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const shiftTabEvent = new KeyboardEvent('keydown', {
            key: keyTab,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        editor!.dispatchEvent(shiftTabEvent);
        await waitForUpdatesAsync();
    }

    public async clickFooterButton(button: ToolbarButton): Promise<void> {
        const toggleButton = this.getFormattingButton(button);
        toggleButton!.click();
        await waitForUpdatesAsync();
    }

    public getButtonCheckedState(button: ToolbarButton): boolean {
        const toggleButton = this.getFormattingButton(button);
        return toggleButton!.checked;
    }

    public getButtonTabIndex(button: ToolbarButton): number {
        const toggleButton = this.getFormattingButton(button);
        return toggleButton!.tabIndex;
    }

    public spaceKeyActivatesButton(button: ToolbarButton): void {
        const toggleButton = this.getFormattingButton(button)!;
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        toggleButton.control.dispatchEvent(event);
    }

    public enterKeyActivatesButton(button: ToolbarButton): void {
        const toggleButton = this.getFormattingButton(button)!;
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        } as KeyboardEventInit);
        toggleButton.control.dispatchEvent(event);
    }

    public async setEditorTextContent(value: string): Promise<void> {
        const lastElement = this.getEditorLastChildElement();
        lastElement!.parentElement!.textContent = value;
        await waitForUpdatesAsync();
    }

    public getEditorLastChildAttribute(attribute: string): string {
        return this.getEditorLastChildElement()?.getAttribute(attribute) || '';
    }

    public getEditorFirstChildTagName(): string {
        return this.getTiptapEditor()?.firstElementChild?.tagName ?? '';
    }

    public getEditorFirstChildTextContent(): string {
        return this.getTiptapEditor()?.firstElementChild?.textContent ?? '';
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

    public getEditorTagNamesWithClosingTags(): string[] {
        const tagNames: string[] = [];
        const tiptapEditor = this.getTiptapEditor();

        const processNode = (node: Node): void => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as Element;
                tagNames.push(el.tagName);

                el.childNodes.forEach(processNode);

                tagNames.push(`/${el.tagName}`);
            }
        };

        if (tiptapEditor) {
            processNode(tiptapEditor);
        }

        return tagNames.slice(1, -1);
    }

    public getFormattingButtonTextContent(
        toolbarButton: ToolbarButton
    ): string {
        const button = this.getFormattingButton(toolbarButton);
        return button!.textContent!.trim();
    }

    public getFormattingButtonTitle(toolbarButton: ToolbarButton): string {
        const button = this.getFormattingButton(toolbarButton);
        return button!.title;
    }

    public isRichTextEditorActiveElement(): boolean {
        return (
            document.activeElement === this.richTextEditorElement
            && document.activeElement?.shadowRoot?.activeElement
                === this.getTiptapEditor()
        );
    }

    public getEditorTabIndex(): string {
        return this.getTiptapEditor()?.getAttribute('tabindex') ?? '';
    }

    public async setFooterHidden(footerHidden: boolean): Promise<void> {
        if (footerHidden) {
            this.richTextEditorElement.setAttribute('footer-hidden', '');
        } else {
            this.richTextEditorElement.removeAttribute('footer-hidden');
        }
        await waitForUpdatesAsync();
    }

    public isFooterHidden(): boolean {
        const footerSection = this.getFooter()!;
        return window.getComputedStyle(footerSection).display === 'none';
    }

    public async setDisabled(disabled: boolean): Promise<void> {
        if (disabled) {
            this.richTextEditorElement.setAttribute('disabled', '');
        } else {
            this.richTextEditorElement.removeAttribute('disabled');
        }
        await waitForUpdatesAsync();
    }

    public isButtonDisabled(button: ToolbarButton): boolean {
        const toggleButton = this.getFormattingButton(button)!;
        return toggleButton.hasAttribute('disabled');
    }

    public getPlaceholderValue(): string {
        const editor = this.getTiptapEditor()!;
        return editor.firstElementChild?.getAttribute('data-placeholder') ?? '';
    }

    private getEditorSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('.editor');
    }

    private getFooter(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot!.querySelector(
            '.footer-section'
        );
    }

    private getTiptapEditor(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            '.ProseMirror'
        );
    }

    private getFormattingButton(
        button: ToolbarButton
    ): ToggleButton | null | undefined {
        const buttons: NodeListOf<ToggleButton> = this.richTextEditorElement.shadowRoot!.querySelectorAll(
            'nimble-toggle-button'
        );
        return buttons[button];
    }

    private getEditorLastChildElement(): Element | null | undefined {
        let lastElement = this.getTiptapEditor()?.lastElementChild;

        while (lastElement?.lastElementChild) {
            lastElement = lastElement?.lastElementChild;
        }
        return lastElement;
    }
}

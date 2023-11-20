import { keySpace, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import type { RichTextEditor } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { ToggleButton } from '../../../toggle-button';
import { ToolbarButton, ToolbarButtonKey } from './types';
import {
    getTagsFromElement,
    getLeafContentsFromElement,
    getLastChildElement,
    getLastChildElementAttribute
} from '../../models/testing/markdown-parser-utils';

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

    public async pressShiftEnterKeysInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const shiftEnterEvent = new KeyboardEvent('keydown', {
            key: keyEnter,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        });
        editor!.dispatchEvent(shiftEnterEvent);
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

    /**
     * In testing environment, when clicking on the footer button, it may not persist in the same state if any editor transaction occurs in between.
     * This behavior is likely due to dynamic modifications of formatting button states based on cursor positions during editor transactions.
     * Setting the "force" parameter to true activates the formatting button state; when set to false, it deactivates the state.
     * If unset, the state toggles by interacting with it once.
     */
    public async toggleFooterButton(
        button: ToolbarButton,
        force?: boolean
    ): Promise<void> {
        const toggleButton = this.getFormattingButton(button);
        const event = new Event('mousedown', { bubbles: true });
        toggleButton!.dispatchEvent(event);
        toggleButton!.click();
        let format = Object.keys(ToolbarButton).find(
            key => ToolbarButton[key as ToolbarButtonKey] === button
        );
        // In the editor, the isActive() method expects the format name to be 'italic' instead of 'italics.'
        // As it was consistently represent it as 'italics' elsewhere just updated it here
        if (format === 'italics') {
            format = 'italic';
        }
        if (force === true || force === false) {
            if (
                this.richTextEditorElement.tiptapEditor.isActive(format!)
                !== force
            ) {
                toggleButton!.dispatchEvent(event);
                toggleButton!.click();
            }
        }
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

    public pasteToEditor(text: string): void {
        const editor = this.getTiptapEditor();
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData?.setData('text/plain', text);
        editor!.dispatchEvent(pasteEvent);
    }

    // Simulate the actual pasting of content by passing the extracted HTML string as an argument and setting the format to 'text/html',
    // as in the [DataFormat](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer) object.
    // For example, when copying a link, the clipboard stores information that includes the anchor tag, href attribute value etc, and paste it as an HTML string
    public pasteHTMLToEditor(htmlString: string): void {
        const editor = this.getTiptapEditor();
        const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: new DataTransfer()
        });
        pasteEvent.clipboardData?.setData('text/html', htmlString);
        editor!.dispatchEvent(pasteEvent);
    }

    public async setEditorTextContent(value: string): Promise<void> {
        const lastElement = this.getEditorLastChildElement();
        const textNode = document.createTextNode(value);
        lastElement.parentElement!.appendChild(textNode);
        await waitForUpdatesAsync();
    }

    public async replaceEditorContent(value: string): Promise<void> {
        const lastElement = this.getEditorLastChildElement();
        lastElement.parentElement!.textContent = value;
        await waitForUpdatesAsync();
    }

    public getEditorLastChildAttribute(attribute: string): string {
        return getLastChildElementAttribute(
            attribute,
            this.getTiptapEditor() as HTMLElement
        );
    }

    public getEditorFirstChildTagName(): string {
        return this.getTiptapEditor()?.firstElementChild?.tagName ?? '';
    }

    public getEditorFirstChildTextContent(): string {
        return this.getTiptapEditor()?.firstElementChild?.textContent ?? '';
    }

    public getEditorTextContents(): string[] {
        return Array.from(this.getTiptapEditor()!.querySelectorAll('*')).map(
            el => el.textContent || ''
        );
    }

    public getEditorTagNames(): string[] {
        return getTagsFromElement(this.getTiptapEditor() as HTMLElement);
    }

    public getEditorLeafContents(): string[] {
        return getLeafContentsFromElement(
            this.getTiptapEditor() as HTMLElement
        );
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

    private getEditorLastChildElement(): Element {
        return getLastChildElement(this.getTiptapEditor() as HTMLElement)!;
    }
}

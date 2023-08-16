import { keySpace, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import type { RichTextEditor } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { ToggleButton } from '../../toggle-button';

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

    public getSlotName(): string {
        const slotElement = this.richTextEditorElement.shadowRoot?.querySelector('slot');
        return slotElement!.getAttribute('name') ?? '';
    }

    public getSlotPartName(): string {
        const slotElement = this.richTextEditorElement.shadowRoot?.querySelector('slot');
        return slotElement?.parentElement!.getAttribute('part') ?? '';
    }

    public async clickFooterButton(className: string): Promise<void> {
        const button = this.getFormattingButton(className);
        button!.click();
        await waitForUpdatesAsync();
    }

    public async clickBoldButton(): Promise<void> {
        const boldButton = this.getFormattingButton('bold');
        boldButton!.click();
        await waitForUpdatesAsync();
    }

    public async clickItalicsButton(): Promise<void> {
        const italicsButton = this.getFormattingButton('italics');
        italicsButton!.click();
        await waitForUpdatesAsync();
    }

    public async clickBulletListButton(): Promise<void> {
        const bulletListButton = this.getFormattingButton('bullet-list');
        bulletListButton!.click();
        await waitForUpdatesAsync();
    }

    public async clickNumberedListButton(): Promise<void> {
        const numberedListButton = this.getFormattingButton('numbered-list');
        numberedListButton!.click();
        await waitForUpdatesAsync();
    }

    public getButtonCheckedState(className: string): boolean {
        const button = this.getFormattingButton(className);
        return button!.checked;
    }

    public getButtonContentHiddenState(className: string): boolean {
        const button = this.getFormattingButton(className);
        return button!.contentHidden;
    }

    public getButtonAppearance(className: string): string {
        const button = this.getFormattingButton(className);
        return button!.appearance;
    }

    public getButtonSlotName(className: string): string {
        const button = this.getFormattingButton(className);
        return button!.slot;
    }

    public getButtonIconTagName(className: string): string {
        const button = this.getFormattingButton(className);
        return button!.firstElementChild!.tagName;
    }

    public getButtonTabIndex(className: string): number {
        const button = this.getFormattingButton(className);
        return button!.tabIndex;
    }

    public spaceKeyActivatesButton(className: string): void {
        const button = this.getFormattingButton(className)!;
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        button.control.dispatchEvent(event);
    }

    public enterKeyActivatesButton(className: string): void {
        const button = this.getFormattingButton(className)!;
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        } as KeyboardEventInit);
        button.control.dispatchEvent(event);
    }

    public async setEditorTextContent(value: string): Promise<void> {
        let lastElement = this.getTiptapEditor()?.lastElementChild;

        while (lastElement?.lastElementChild) {
            lastElement = lastElement?.lastElementChild;
        }
        lastElement!.parentElement!.textContent = value;
        await waitForUpdatesAsync();
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

    private getEditorSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('.editor');
    }

    private getTiptapEditor(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            '.ProseMirror'
        );
    }

    private getFormattingButton(
        className: string
    ): ToggleButton | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            `.${className}`
        );
    }
}

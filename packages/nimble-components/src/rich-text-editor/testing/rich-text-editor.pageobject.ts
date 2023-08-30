import { keySpace, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
import type { RichTextEditor } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import type { ToggleButton } from '../../toggle-button';
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

    /**
     * To click a formatting button in the footer section, pass its position value as an index (starting from '0')
     * @param button can be imported from an enum for each button using the `ButtonIndex`.
     */
    public async clickFooterButton(button: ToolbarButton): Promise<void> {
        const toggleButton = this.getFormattingButton(button);
        toggleButton!.click();
        await waitForUpdatesAsync();
    }

    /**
     * To retrieve the checked state of the button, provide its position value as an index (starting from '0')
     * @param button can be imported from an enum for each button using the `ButtonIndex`.
     */
    public getButtonCheckedState(button: ToolbarButton): boolean {
        const toggleButton = this.getFormattingButton(button);
        return toggleButton!.checked;
    }

    /**
     * To retrieve the tab index of the button, provide its position value as an index (starting from '0')
     * @param button can be imported from an enum for each button using the `ButtonIndex`.
     */
    public getButtonTabIndex(button: ToolbarButton): number {
        const toggleButton = this.getFormattingButton(button);
        return toggleButton!.tabIndex;
    }

    /**
     * To trigger a space key press for the button, provide its position value as an index (starting from '0')
     * @param button can be imported from an enum for each button using the `ButtonIndex`.
     */
    public spaceKeyActivatesButton(button: ToolbarButton): void {
        const toggleButton = this.getFormattingButton(button)!;
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        toggleButton.control.dispatchEvent(event);
    }

    /**
     * To trigger a enter key press for the button, provide its position value as an index (starting from '0')
     * @param button can be imported from an enum for each button using the `ButtonIndex`.
     */
    public enterKeyActivatesButton(button: ToolbarButton): void {
        const toggleButton = this.getFormattingButton(button)!;
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        } as KeyboardEventInit);
        toggleButton.control.dispatchEvent(event);
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

    public getFormattingButton(
        index: ToolbarButton
    ): ToggleButton | null | undefined {
        const buttons: NodeListOf<ToggleButton> = this.richTextEditorElement.shadowRoot!.querySelectorAll(
            'nimble-toggle-button'
        );
        return buttons[index];
    }

    public async isRichTextEditorActiveElement(): Promise<boolean> {
        await waitForUpdatesAsync();
        return document.activeElement === this.richTextEditorElement
            && document.activeElement?.shadowRoot?.activeElement === this.getTiptapEditor();
    }

    private getTiptapEditor(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector(
            '.ProseMirror'
        );
    }

    private getEditorSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('.editor');
    }
}

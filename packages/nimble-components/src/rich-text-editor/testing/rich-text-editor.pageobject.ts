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

    /**
     * To click a formatting button in the footer section, pass its position value as an index (starting from '0')
     * @param buttonIndex can be imported from an enum for each button using the `ButtonIndex`.
     */
    public async clickFooterButton(buttonIndex: number): Promise<void> {
        const button = this.getFormattingButton(buttonIndex);
        button!.click();
        await waitForUpdatesAsync();
    }

    /**
     * To retrieve the checked state of the button, provide its position value as an index (starting from '0')
     * @param buttonIndex can be imported from an enum for each button using the `ButtonIndex`.
     */
    public getButtonCheckedState(buttonIndex: number): boolean {
        const button = this.getFormattingButton(buttonIndex);
        return button!.checked;
    }

    /**
     * To retrieve the tab index of the button, provide its position value as an index (starting from '0')
     * @param buttonIndex can be imported from an enum for each button using the `ButtonIndex`.
     */
    public getButtonTabIndex(buttonIndex: number): number {
        const button = this.getFormattingButton(buttonIndex);
        return button!.tabIndex;
    }

    /**
     * To trigger a space key press for the button, provide its position value as an index (starting from '0')
     * @param buttonIndex can be imported from an enum for each button using the `ButtonIndex`.
     */
    public spaceKeyActivatesButton(buttonIndex: number): void {
        const button = this.getFormattingButton(buttonIndex)!;
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        button.control.dispatchEvent(event);
    }

    /**
     * To trigger a enter key press for the button, provide its position value as an index (starting from '0')
     * @param buttonIndex can be imported from an enum for each button using the `ButtonIndex`.
     */
    public enterKeyActivatesButton(buttonIndex: number): void {
        const button = this.getFormattingButton(buttonIndex)!;
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
        index: number
    ): ToggleButton | null | undefined {
        const buttons: NodeListOf<ToggleButton> = this.richTextEditorElement.shadowRoot!.querySelectorAll(
            'nimble-toggle-button'
        );
        return buttons[index];
    }
}

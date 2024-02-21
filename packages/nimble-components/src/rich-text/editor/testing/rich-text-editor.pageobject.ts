import {
    keySpace,
    keyEnter,
    keyTab,
    keyEscape
} from '@microsoft/fast-web-utilities';
import type { RichTextEditor } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { ToggleButton } from '../../../toggle-button';
import {
    ArrowKeyButton,
    MappingConfiguration,
    ToolbarButton,
    ToolbarButtonKey
} from './types';
import {
    getTagsFromElement,
    getLeafContentsFromElement,
    getLastChildElement,
    getLastChildElementAttribute
} from '../../models/testing/markdown-parser-utils';
import { richTextMentionUsersViewTag } from '../../../rich-text-mention/users/view';
import { RichTextMarkdownParser } from '../../models/markdown-parser';
import { buttonTag, type Button } from '../../../button';
import { richTextMentionListboxTag } from '../../mention-listbox';
import { listOptionTag, type ListOption } from '../../../list-option';
import { anchoredRegionTag } from '../../../anchored-region';
import { iconAtTag } from '../../../icons/at';
import { MarkdownParserMentionConfiguration } from '../../models/markdown-parser-mention-configuration';
import { MentionInternals } from '../../../rich-text-mention/base/models/mention-internals';
import { MappingUserConfig } from '../../../rich-text-mention/users/models/mapping-user-config';

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
        editor.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressEnterKeyInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: keyEnter,
            bubbles: true,
            cancelable: true
        });
        editor.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressEscapeKeyInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: keyEscape,
            bubbles: true,
            cancelable: true
        });
        editor.dispatchEvent(event);
        await waitForUpdatesAsync();
    }

    public async pressArrowKeyInEditor(
        arrowButton: ArrowKeyButton
    ): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: arrowButton,
            bubbles: true,
            cancelable: true
        });
        editor.dispatchEvent(event);
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
        editor.dispatchEvent(shiftEnterEvent);
        await waitForUpdatesAsync();
    }

    public async pressTabKeyInEditor(): Promise<void> {
        const editor = this.getTiptapEditor();
        const event = new KeyboardEvent('keydown', {
            key: keyTab,
            bubbles: true,
            cancelable: true
        });
        editor.dispatchEvent(event);
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
        editor.dispatchEvent(shiftTabEvent);
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

    public async clickUserMentionButton(): Promise<void> {
        const userMentionButton = this.getUserMentionButton();
        userMentionButton!.click();
        await waitForUpdatesAsync();
    }

    public getMentionButtonIcon(buttonIndex: number): string | undefined {
        const buttons: Button[] = this.getMentionButtons()!;
        return buttons[buttonIndex]?.firstElementChild?.tagName;
    }

    public getMentionButtonTitle(buttonIndex: number): string {
        const buttons: Button[] = this.getMentionButtons()!;
        return buttons[buttonIndex]?.getAttribute('title') ?? '';
    }

    public getMentionButtonLabel(buttonIndex: number): string {
        const buttons: Button[] = this.getMentionButtons()!;
        return buttons[buttonIndex]?.innerText ?? '';
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
        editor.dispatchEvent(pasteEvent);
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
        editor.dispatchEvent(pasteEvent);
    }

    public async setEditorTextContent(value: string): Promise<void> {
        this.richTextEditorElement.tiptapEditor
            .chain()
            .focus()
            .insertContent({
                type: 'text',
                text: value
            })
            .run();
        await waitForUpdatesAsync();
    }

    public async setCursorPosition(position: number): Promise<void> {
        this.richTextEditorElement.tiptapEditor.commands.setTextSelection(
            position
        );
        await waitForUpdatesAsync();
    }

    public async replaceEditorContent(value: string): Promise<void> {
        const lastElement = this.getEditorLastChildElement();
        lastElement.parentElement!.textContent = value;
        await waitForUpdatesAsync();
    }

    public async sliceEditorContent(from: number, to: number): Promise<void> {
        this.richTextEditorElement.tiptapEditor
            .chain()
            .focus()
            .deleteRange({ from, to })
            .run();
        await waitForUpdatesAsync();
    }

    public getEditorLastChildAttribute(attribute: string): string {
        return getLastChildElementAttribute(attribute, this.getTiptapEditor());
    }

    public isMentionListboxOpened(): boolean {
        return (
            !this.getMentionListbox()
                ?.shadowRoot?.querySelector(anchoredRegionTag)
                ?.hasAttribute('hidden') ?? false
        );
    }

    public getEditorMentionViewAttributeValues(attribute: string): string[] {
        return Array.from(
            this.getTiptapEditor().querySelectorAll(richTextMentionUsersViewTag)
        ).map(el => el.getAttribute(attribute) || '');
    }

    public getEditorFirstChildTagName(): string {
        return this.getTiptapEditor().firstElementChild?.tagName ?? '';
    }

    public getEditorFirstChildTextContent(): string {
        return this.getTiptapEditor().firstElementChild?.textContent ?? '';
    }

    public getEditorTextContents(): string[] {
        return Array.from(this.getTiptapEditor().querySelectorAll('*')).map(
            el => el.textContent || ''
        );
    }

    public getEditorTagNames(): string[] {
        return getTagsFromElement(this.getTiptapEditor());
    }

    // Return list of tags, excluding those such as 'IMG' (prosemirror-separator) that do not affect the UI or markdown output.
    // These tags are considered extraneous and are added by prosemirror.
    public getMarkdownRenderedTagNames(): string[] {
        return getTagsFromElement(this.getTiptapEditor()).filter(
            tag => tag !== 'IMG'
        );
    }

    public getEditorLeafContents(): string[] {
        return getLeafContentsFromElement(this.getTiptapEditor());
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
        return this.getTiptapEditor().getAttribute('tabindex') ?? '';
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
        const editor = this.getTiptapEditor();
        return editor.firstElementChild?.getAttribute('data-placeholder') ?? '';
    }

    public getParsedHtmlFromMarkdown(
        markdown: string,
        mappings?: MappingConfiguration[]
    ): string {
        const parserMentionConfigForUser = this.getParserMentionConfigForUser(mappings);
        const parseResult = RichTextMarkdownParser.parseMarkdownToDOM(
            markdown,
            [parserMentionConfigForUser]
        );
        return this.richTextEditorElement.xmlSerializer.serializeToString(
            parseResult.fragment
        );
    }

    public async focusOutEditor(): Promise<void> {
        const focusout = new FocusEvent('focusout');
        this.richTextEditorElement.dispatchEvent(focusout);
        await waitForUpdatesAsync();
    }

    public getMentionListboxItemsName(): string[] {
        const listItemsName: string[] = [];
        this.getAllListItemsInMentionBox().forEach(item => (item.hidden ? null : listItemsName.push(item.textContent!)));
        return listItemsName;
    }

    public getSelectedOption(): string {
        const nodeList = this.getAllListItemsInMentionBox();
        return (
            Array.from(nodeList).find(
                item => item.selected && !item.hasAttribute('hidden')
            )?.textContent ?? ''
        );
    }

    public async clickMentionListboxOption(index: number): Promise<void> {
        const listOption = this.getAllListItemsInMentionBox()[index];
        listOption?.click();
        await waitForUpdatesAsync();
    }

    public moveCursorToStart(): void {
        this.richTextEditorElement.tiptapEditor.commands.focus('start');
    }

    public getCursorPosition(): number {
        return this.richTextEditorElement.tiptapEditor.state.selection.anchor;
    }

    private getEditorSection(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot?.querySelector('.editor');
    }

    private getFooter(): Element | null | undefined {
        return this.richTextEditorElement.shadowRoot!.querySelector(
            '.footer-section'
        );
    }

    private getTiptapEditor(): HTMLDivElement {
        return this.richTextEditorElement.shadowRoot!.querySelector<HTMLDivElement>(
            '.ProseMirror'
        )!;
    }

    private getFormattingButton(
        button: ToolbarButton
    ): ToggleButton | null | undefined {
        const buttons: NodeListOf<ToggleButton> = this.richTextEditorElement.shadowRoot!.querySelectorAll(
            'nimble-toggle-button'
        );
        return buttons[button];
    }

    private getUserMentionButton(): Button | null | undefined {
        const buttons: Button[] = this.getMentionButtons()!;
        return buttons.find(button => button.querySelector(iconAtTag));
    }

    private getMentionButtons(): Button[] | null | undefined {
        return Array.from(
            this.richTextEditorElement.shadowRoot!.querySelectorAll(buttonTag)
        );
    }

    private getMentionListbox(): Element | null {
        return this.richTextEditorElement.shadowRoot!.querySelector(
            richTextMentionListboxTag
        );
    }

    private getAllListItemsInMentionBox(): NodeListOf<ListOption> {
        return this.getMentionListbox()!.querySelectorAll(listOptionTag);
    }

    private getEditorLastChildElement(): Element {
        return getLastChildElement(this.getTiptapEditor())!;
    }

    private getParserMentionConfigForUser(
        mappings: MappingConfiguration[] = []
    ): MarkdownParserMentionConfiguration {
        const mentionInternals = new MentionInternals(
            {
                character: '',
                icon: '',
                viewElement: richTextMentionUsersViewTag
            },
            () => {}
        );
        mentionInternals.pattern = '^user:(.*)';
        mappings.forEach(mapping => {
            const mappingConfig = new MappingUserConfig(
                mapping.key,
                mapping.displayName
            );
            mentionInternals.mappingConfigs = new Map().set(
                mapping.key,
                mappingConfig
            );
        });
        const parserMentionConfig = new MarkdownParserMentionConfiguration(
            mentionInternals
        );
        return parserMentionConfig;
    }
}

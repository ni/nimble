import { observable, attr, DOM } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem
} from '@microsoft/fast-foundation';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { findParentNode, isList, AnyExtension, Extension } from '@tiptap/core';

import type { PlaceholderOptions } from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import { template } from './template';
import { styles } from './styles';
import type { ToggleButton } from '../../toggle-button';
import { TipTapNodeName, mentionPluginPrefix } from './types';
import type { ErrorPattern } from '../../patterns/error/types';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichTextMarkdownSerializer } from '../models/markdown-serializer';
import { RichText } from '../base';
import type { RichTextMentionListBox } from '../mention-list-box';
import type { MappingConfigs } from '../../rich-text-mention/base/types';
import type { MentionExtensionConfiguration } from '../models/mention-extension-configuration';
import { createTiptapEditor } from './models/create-tiptap-editor';
import { EditorConfiguration } from '../models/editor-configuration';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
}

/**
 * A nimble styled rich text editor
 */
export class RichTextEditor extends RichText implements ErrorPattern {
    /**
     * @internal
     */
    public editor = this.createEditor();

    /**
     * @internal
     */
    public tiptapEditor = createTiptapEditor(
        this,
        [],
        this.mentionListBox,
        this.placeholder
    );

    /**
     * @internal
     */
    public readonly xmlSerializer = new XMLSerializer();

    /**
     * @internal
     */
    public richTextMarkdownSerializer = new RichTextMarkdownSerializer([]);

    /**
     * Whether to disable user from editing and interacting with toolbar buttons
     *
     * @public
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;

    /**
     * Whether to hide the footer of the rich text editor
     *
     * @public
     * HTML Attribute: footer-hidden
     */
    @attr({ attribute: 'footer-hidden', mode: 'boolean' })
    public footerHidden = false;

    /**
     * Whether to display the error state.
     *
     * @public
     * HTML Attribute: error-visible
     */
    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;

    /**
     * A message explaining why the value is invalid.
     *
     * @public
     * HTML Attribute: error-text
     */
    @attr({ attribute: 'error-text' })
    public errorText?: string;

    /**
     * @public
     * HTML Attribute: placeholder
     */
    @attr
    public placeholder?: string;

    /**
     * True if the editor is empty or contains only whitespace, false otherwise.
     *
     * @public
     */
    public get empty(): boolean {
        // Tiptap [isEmpty](https://tiptap.dev/api/editor#is-empty) returns false even if the editor has only whitespace.
        // Get the prose mirror textContent of all the nodes with whitespace trimmed to see if it is empty
        // Mention nodes are formatted as empty text content, so if empty make sure there are no mention nodes remaining
        if (this.tiptapEditor.state.doc.textContent.trim() === '') {
            let hasMention = false;
            this.tiptapEditor.state.doc.descendants(node => {
                if (node.type.name.startsWith(mentionPluginPrefix)) {
                    hasMention = true;
                }
                const continueDescent = hasMention === false;
                return continueDescent;
            });
            return !hasMention;
        }
        return false;
    }

    /**
     * @internal
     */
    public mentionListBox?: RichTextMentionListBox;

    /**
     * @internal
     */
    @observable
    public boldButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public italicsButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public bulletListButton!: ToggleButton;

    /**
     * @internal
     */
    @observable
    public numberedListButton!: ToggleButton;

    /**
     * The width of the vertical scrollbar, if displayed.
     * @internal
     */
    @observable
    public scrollbarWidth = -1;

    /**
     * @internal
     */
    @observable
    public activeMentionCharacter = '';

    /**
     * @internal
     */
    @observable
    public activeMappingConfigs?: MappingConfigs;

    /**
     * @internal
     */
    public editorContainer!: HTMLDivElement;

    private resizeObserver?: ResizeObserver;
    private updateScrollbarWidthQueued = false;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        if (!this.editor.isConnected) {
            this.editorContainer.append(this.editor);
        }
        this.bindEditorTransactionEvent();
        this.bindEditorUpdateEvent();
        this.stopNativeInputEventPropagation();
        this.resizeObserver = new ResizeObserver(() => this.onResize());
        this.resizeObserver.observe(this);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.unbindEditorTransactionEvent();
        this.unbindEditorUpdateEvent();
        this.unbindNativeInputEvent();
        this.resizeObserver?.disconnect();
    }

    /**
     * @internal
     */
    public disabledChanged(): void {
        this.disableEditor();
    }

    /**
     * Update the placeholder text and view of the editor.
     * @internal
     */
    public placeholderChanged(_prev: unknown, _next: unknown): void {
        const placeholderExtension = this.getTipTapExtension(
            'placeholder'
        ) as Extension<PlaceholderOptions>;
        placeholderExtension.options.placeholder = this.placeholder ?? '';
        this.tiptapEditor.view.dispatch(this.tiptapEditor.state.tr);

        this.queueUpdateScrollbarWidth();
    }

    /**
     * @internal
     */
    public ariaLabelChanged(_prev: unknown, _next: unknown): void {
        if (this.ariaLabel !== null && this.ariaLabel !== undefined) {
            this.editor.setAttribute('aria-label', this.ariaLabel);
        } else {
            this.editor.removeAttribute('aria-label');
        }
    }

    /**
     * @internal
     */
    public configurationChanged(
        prev: EditorConfiguration | undefined,
        next: EditorConfiguration
    ): void {
        if (this.isMentionExtensionConfigUnchanged(prev, next)) {
            this.setMarkdown(this.getMarkdown());
        } else {
            const mentionExtensionConfig = this.getMentionExtensionConfig();
            const currentStateMarkdown = this.getMarkdown();
            this.richTextMarkdownSerializer = new RichTextMarkdownSerializer(
                mentionExtensionConfig.map(config => config.name)
            );
            this.initializeEditor();
            this.setMarkdown(currentStateMarkdown);
        }
        this.setActiveMappingConfigs();
    }

    /**
     * @internal
     */
    public activeMentionCharacterChanged(): void {
        this.setActiveMappingConfigs();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleBold().run();
    }

    /**
     * Toggle the bold mark and focus back to the editor
     * @internal
     */
    public boldButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleBold().run();
            return false;
        }
        return true;
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleItalic().run();
    }

    /**
     * Toggle the italics mark and focus back to the editor
     * @internal
     */
    public italicsButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleItalic().run();
            return false;
        }
        return true;
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleBulletList().run();
    }

    /**
     * Toggle the unordered list node and focus back to the editor
     * @internal
     */
    public bulletListButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleBulletList().run();
            return false;
        }
        return true;
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonClick(): void {
        this.tiptapEditor.chain().focus().toggleOrderedList().run();
    }

    /**
     * Toggle the ordered list node and focus back to the editor
     * @internal
     */
    public numberedListButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().focus().toggleOrderedList().run();
            return false;
        }
        return true;
    }

    /**
     * Inserts the mention character into the editor and focus back to the editor
     * @internal
     */
    public mentionButtonClick(character: string): void {
        this.tiptapEditor
            .chain()
            .insertContent(
                this.shouldInsertSpace() ? ` ${character}` : character
            )
            .focus()
            .run();
    }

    /**
     * Inserts the mention character into the editor and focus back to the editor
     * @internal
     */
    public mentionButtonKeyDown(
        event: KeyboardEvent,
        character: string
    ): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor
                .chain()
                .insertContent(
                    this.shouldInsertSpace() ? ` ${character}` : character
                )
                .focus()
                .run();
            return false;
        }
        return true;
    }

    /**
     * This function load tip tap editor with provided markdown content by parsing into html
     * @public
     */
    public setMarkdown(markdown: string): void {
        const html = this.getHtmlContent(markdown);
        this.tiptapEditor.commands.setContent(html);
    }

    /**
     * This function returns markdown string by serializing tiptap editor document using prosemirror MarkdownSerializer
     * @public
     */
    public getMarkdown(): string {
        return this.richTextMarkdownSerializer.serializeDOMToMarkdown(
            this.tiptapEditor.state.doc
        );
    }

    /**
     * @internal
     */
    public stopEventPropagation(event: Event): boolean {
        // Don't bubble the 'change' event from the toggle button because
        // all the formatting button has its own 'toggle' event through 'click' and 'keydown'.
        event.stopPropagation();
        return false;
    }

    public getMentionedHrefs(): string[] {
        const mentionedHrefs = new Set<string>();
        this.tiptapEditor.state.doc.descendants(node => {
            if (node.type.name.startsWith(mentionPluginPrefix)) {
                mentionedHrefs.add(node.attrs.href as string);
            }
        });
        return Array.from(mentionedHrefs);
    }

    public getMentionExtensionConfig(): MentionExtensionConfiguration[] {
        return this.configuration instanceof EditorConfiguration
            ? this.configuration.mentionExtensionConfig
            : [];
    }

    protected override createConfig(): EditorConfiguration {
        return new EditorConfiguration(this.mentionElements);
    }

    private isMentionExtensionConfigUnchanged(
        prev: EditorConfiguration | undefined,
        next: EditorConfiguration
    ): boolean {
        const prevConfigCharacters = prev?.mentionExtensionConfig
            .map(config => config.character)
            .sort((a, b) => a.localeCompare(b))
            .toString();
        const nextConfigCharacters = next.mentionExtensionConfig
            .map(config => config.character)
            .sort((a, b) => a.localeCompare(b))
            .toString();
        return prevConfigCharacters === nextConfigCharacters;
    }

    private createEditor(): HTMLDivElement {
        const editor = document.createElement('div');
        editor.className = 'editor';
        editor.setAttribute('aria-multiline', 'true');
        editor.setAttribute('role', 'textbox');
        editor.setAttribute('aria-disabled', 'false');
        return editor;
    }

    private initializeEditor(): void {
        this.unbindEditorTransactionEvent();
        this.unbindEditorUpdateEvent();
        this.unbindNativeInputEvent();
        this.tiptapEditor?.destroy();
        this.tiptapEditor = createTiptapEditor(
            this,
            this.configuration instanceof EditorConfiguration
                ? this.configuration.mentionExtensionConfig
                : [],
            this.mentionListBox,
            this.placeholder
        );
        this.disableEditor();
        this.bindEditorTransactionEvent();
        this.bindEditorUpdateEvent();
        this.stopNativeInputEventPropagation();
    }

    /**
     * This function takes the Fragment from parseMarkdownToDOM function and return the serialized string using XMLSerializer
     */
    private getHtmlContent(markdown: string): string {
        const parseResult = RichTextMarkdownParser.parseMarkdownToDOM(
            markdown,
            this.configuration?.parserMentionConfig
        );
        return this.xmlSerializer.serializeToString(parseResult.fragment);
    }

    /**
     * Binding the "transaction" event to the editor allows continuous monitoring the events and updating the button state in response to
     * various actions such as mouse events, keyboard events, changes in the editor content etc,.
     * https://tiptap.dev/api/events#transaction
     */
    private bindEditorTransactionEvent(): void {
        this.tiptapEditor.on('transaction', () => {
            this.updateEditorButtonsState();
        });
    }

    private unbindEditorTransactionEvent(): void {
        this.tiptapEditor.off('transaction');
    }

    private updateEditorButtonsState(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        const { extensionManager, state } = this.tiptapEditor;
        const { extensions } = extensionManager;
        const { selection } = state;
        const parentList = findParentNode((node: { type: { name: string } }) => isList(node.type.name, extensions))(selection);

        this.boldButton.checked = this.tiptapEditor.isActive('bold');
        this.italicsButton.checked = this.tiptapEditor.isActive('italic');
        this.bulletListButton.checked = parentList?.node.type.name === TipTapNodeName.bulletList;
        this.numberedListButton.checked = parentList?.node.type.name === TipTapNodeName.numberedList;
    }

    private keyActivatesButton(event: KeyboardEvent): boolean {
        switch (event.key) {
            case keySpace:
            case keyEnter:
                return true;
            default:
                return false;
        }
    }

    private unbindEditorUpdateEvent(): void {
        this.tiptapEditor.off('update');
    }

    /**
     * input event is fired when there is a change in the content of the editor.
     *
     * https://tiptap.dev/api/events#update
     */
    private bindEditorUpdateEvent(): void {
        this.tiptapEditor.on('update', () => {
            this.$emit('input');
            this.queueUpdateScrollbarWidth();
        });
    }

    private disableEditor(): void {
        this.tiptapEditor.setEditable(!this.disabled);
        this.setEditorTabIndex();
        this.editor.setAttribute(
            'aria-disabled',
            this.disabled ? 'true' : 'false'
        );
    }

    /**
     * Stopping the native input event propagation emitted by the contenteditable element in the Tiptap
     * since there is an issue (linked below) in ProseMirror where selecting the text and removing it
     * does not trigger the native HTMLElement input event. So using the "update" event emitted by the
     * Tiptap to capture it as an "input" customEvent in the rich text editor.
     *
     * Prose Mirror issue: https://discuss.prosemirror.net/t/how-to-handle-select-backspace-delete-cut-type-kind-of-events-handletextinput-or-handledomevents-input-doesnt-help/4844
     */
    private stopNativeInputEventPropagation(): void {
        this.tiptapEditor.view.dom.addEventListener('input', event => {
            event.stopPropagation();
        });
    }

    private unbindNativeInputEvent(): void {
        this.tiptapEditor.view.dom.removeEventListener('input', () => {});
    }

    private queueUpdateScrollbarWidth(): void {
        if (!this.$fastController.isConnected) {
            return;
        }
        if (!this.updateScrollbarWidthQueued) {
            this.updateScrollbarWidthQueued = true;
            DOM.queueUpdate(() => this.updateScrollbarWidth());
        }
    }

    private updateScrollbarWidth(): void {
        this.updateScrollbarWidthQueued = false;
        this.scrollbarWidth = this.tiptapEditor.view.dom.offsetWidth
            - this.tiptapEditor.view.dom.clientWidth;
    }

    private onResize(): void {
        this.scrollbarWidth = this.tiptapEditor.view.dom.offsetWidth
            - this.tiptapEditor.view.dom.clientWidth;
    }

    private getTipTapExtension(
        extensionName: string
    ): AnyExtension | undefined {
        return this.tiptapEditor.extensionManager.extensions.find(
            (extension: { name: string }) => extension.name === extensionName
        );
    }

    private setEditorTabIndex(): void {
        this.tiptapEditor.setOptions({
            editorProps: {
                attributes: {
                    tabindex: this.disabled ? '-1' : '0'
                }
            }
        });
    }

    private setActiveMappingConfigs(): void {
        this.activeMappingConfigs = this.activeMentionCharacter
            ? this.getMentionExtensionConfig().find(
                config => config.character === this.activeMentionCharacter
            )?.mappingConfigs
            : undefined;
    }

    private shouldInsertSpace(): boolean {
        const { $anchor, $head } = this.tiptapEditor.view.state.selection;

        const isAtStartOfLine = $head.parentOffset === 0 || $anchor.parentOffset === 0;
        const nodeBeforeSelection = $anchor.pos < $head.pos ? $anchor.nodeBefore : $head.nodeBefore;
        const isHardBreakNode = nodeBeforeSelection?.type.name === HardBreak.name;
        const hasWhitespaceBeforeCurrentPosition = nodeBeforeSelection?.textContent.endsWith(' ');

        return (
            !isAtStartOfLine
            && !isHardBreakNode
            && !hasWhitespaceBeforeCurrentPosition
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RichTextEditor extends ARIAGlobalStatesAndProperties {}
applyMixins(RichTextEditor, ARIAGlobalStatesAndProperties);

const nimbleRichTextEditor = RichTextEditor.compose({
    baseName: 'rich-text-editor',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextEditor());
export const richTextEditorTag = DesignSystem.tagFor(RichTextEditor);

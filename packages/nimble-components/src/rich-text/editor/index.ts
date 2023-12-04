import { observable, attr, DOM } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem
} from '@microsoft/fast-foundation';
import { keyEnter, keyEscape, keySpace } from '@microsoft/fast-web-utilities';
import {
    Editor,
    findParentNode,
    isList,
    AnyExtension,
    Extension,
    Mark,
    Node,
    mergeAttributes
} from '@tiptap/core';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import Link, { LinkOptions } from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import type { PlaceholderOptions } from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import Mention, { MentionOptions } from '@tiptap/extension-mention';
import HardBreak from '@tiptap/extension-hard-break';
import { Slice, Fragment, Node as FragmentNode } from 'prosemirror-model';
import type { SuggestionProps } from '@tiptap/suggestion';
import { PluginKey } from 'prosemirror-state';
import { keyEnter, keySpace } from '@microsoft/fast-web-utilities';
import { findParentNode, isList, AnyExtension, Extension } from '@tiptap/core';

import type { PlaceholderOptions } from '@tiptap/extension-placeholder';
import { template } from './template';
import { styles } from './styles';
import type { ToggleButton } from '../../toggle-button';
import { TipTapNodeName, mentionPluginPrefix } from './types';
import type { ErrorPattern } from '../../patterns/error/types';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichTextMarkdownSerializer } from '../models/markdown-serializer';
import { RichText } from '../base';
import type { RichTextMentionListBox } from '../mention-list-box';
import { MentionExtensionConfiguration } from '../models/mention-extension-configuration';
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
export class RichTextEditor
    extends RichText<EditorConfiguration>
    implements ErrorPattern {
    /**
     * @internal
     */
    public editor = this.createEditor();

    /**
     * @internal
     */
    public tiptapEditor = createTiptapEditor(this.editor, []);

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
    public editorContainer!: HTMLDivElement;

    @observable
    public mentionExtensionConfig?: MentionExtensionConfiguration[];

    private richTextMarkdownSerializer = new RichTextMarkdownSerializer();

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
    public disabledChanged(_prev: unknown, _next: unknown): void {
        this.tiptapEditor.setEditable(!this.disabled);
        this.setEditorTabIndex();
        this.editor.setAttribute(
            'aria-disabled',
            this.disabled ? 'true' : 'false'
        );
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
        if (this.isOnlyMentionInternalsChanged(prev, next)) {
            this.setMarkdown(this.getMarkdown());
        } else {
            const currentStateMarkdown = this.getMarkdown();
            this.richTextMarkdownSerializer = new RichTextMarkdownSerializer(
                this.configuration?.mentionExtensionConfig.map(
                    config => config.name
                ) ?? []
            );
            this.initializeEditor();
            this.setMarkdown(currentStateMarkdown);
        }
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
     * Toggle the mention node and focus back to the editor
     * @internal
     */
    public mentionButtonClick(character: string): void {
        this.tiptapEditor.chain().insertContent(` ${character}`).focus().run();
    }

    /**
     * Toggle the mention node and focus back to the editor
     * @internal
     */
    public mentionButtonKeyDown(event: KeyboardEvent, character: string): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().insertContent(` ${character}`).focus().run();
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

    protected override updateMentionConfig(): void {
        super.updateMentionConfig();
        if (
            this.mentionElements.every(
                mention => mention.mentionInternals.validConfiguration
            )
        ) {
            this.mentionExtensionConfig = this.mentionElements.map(
                (mention, index) => new MentionExtensionConfiguration(
                    mention.mentionInternals,
                    `mention-plugin-${index}`,
                    this
                )
            );
            this.mentionListBox?.updateMentionExtensionConfig(this.mentionExtensionConfig);

            return;
        }
        this.resetMentionExtensionConfig();
    }

    private resetMentionExtensionConfig(): void {
        this.mentionExtensionConfig = [];
        this.mentionListBox?.updateMentionExtensionConfig([]);
    }
    
    protected override createConfig(): EditorConfiguration {
        return new EditorConfiguration(this.mentionElements);
    }

    private isOnlyMentionInternalsChanged(
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
            this.editor,
            this.configuration?.mentionExtensionConfig ?? []
        );
        this.bindEditorTransactionEvent();
        this.bindEditorUpdateEvent();
        this.stopNativeInputEventPropagation();
    }

    /**
     * Extending the default link mark schema defined in the TipTap.
     *
     * "excludes": https://prosemirror.net/docs/ref/#model.MarkSpec.excludes
     * "inclusive": https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive
     * "parseHTML": https://tiptap.dev/guide/custom-extensions#parse-html
     * "renderHTML": https://tiptap.dev/guide/custom-extensions/#render-html
     */
    private getCustomLinkExtension(): Mark<LinkOptions> {
        return Link.extend({
            // Excludes can be removed/enabled when hyperlink support added
            // See: https://github.com/ni/nimble/issues/1527
            excludes: '_',
            // Inclusive can be updated when hyperlink support added
            // See: https://github.com/ni/nimble/issues/1527
            inclusive: false,
            parseHTML() {
                return [
                    // To load the `nimble-anchor` from the HTML parsed content by markdown-parser as links in the Tiptap editor, the `parseHTML`
                    // of Link extension should return nimble `anchorTag`.
                    // This is because the link mark schema in `markdown-parser.ts` file uses `<nimble-anchor>` as anchor tag and not `<a>`.
                    {
                        tag: anchorTag
                    },
                    // `<a>` tag is added here to support when pasting a link from external source.
                    {
                        tag: 'a'
                    }
                ];
            },
            // HTMLAttribute cannot be in camelCase as we want to match it with the name in Tiptap
            // eslint-disable-next-line @typescript-eslint/naming-convention
            renderHTML({ HTMLAttributes }) {
                // The below 'a' tag should be replaced with 'nimble-anchor' once the below issue is fixed.
                // https://github.com/ni/nimble/issues/1516
                return ['a', HTMLAttributes];
            }
        }).configure({
            // HTMLAttribute cannot be in camelCase as we want to match it with the name in Tiptap
            // eslint-disable-next-line @typescript-eslint/naming-convention
            HTMLAttributes: {
                rel: 'noopener noreferrer',
                target: null
            },
            autolink: true,
            openOnClick: false,
            // linkOnPaste can be enabled when hyperlink support added
            // See: https://github.com/ni/nimble/issues/1527
            linkOnPaste: false,
            validate: href => this.validAbsoluteLinkRegex.test(href)
        });
    }

    private getCustomMentionExtension(
        config: MentionExtensionConfig
    ): Node<MentionOptions> {
        return Mention.extend({
            name: config.name,
            parseHTML() {
                return [
                    {
                        tag: config.viewElement
                    }
                ];
            },
            addAttributes() {
                return {
                    href: {
                        default: null,
                        parseHTML: element => element.getAttribute('mention-href'),
                        renderHTML: attributes => {
                            return {
                                'mention-href': attributes.href as string
                            };
                        }
                    },

                    label: {
                        default: null,
                        parseHTML: element => element.getAttribute('mention-label'),
                        renderHTML: attributes => {
                            return {
                                'mention-label': attributes.label as string
                            };
                        }
                    }
                };
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            renderHTML({ HTMLAttributes }) {
                return [
                    config.viewElement,
                    mergeAttributes(
                        this.options.HTMLAttributes,
                        HTMLAttributes,
                        { 'disable-editing': true }
                    )
                ];
            }
        }).configure({
            suggestion: {
                char: config.character,
                decorationTag: config.viewElement,
                pluginKey: new PluginKey(config.key),
                allowSpaces: true,
                render: () => {
                    let inSuggestionMode = false;
                    return {
                        onStart: (props): void => {
                            inSuggestionMode = true;
                            this.onMention(props);
                        },

                        onUpdate: (props): void => {
                            if (!inSuggestionMode) {
                                return;
                            }
                            this.onMention(props);
                        },

                        onKeyDown: (props): boolean => {
                            if (props.event.key === keyEscape) {
                                inSuggestionMode = false;
                            }
                            return (
                                this.mentionListBox?.keydownHandler(
                                    props.event
                                ) ?? false
                            );
                        },

                        onExit: (): void => {
                            this.mentionListBox?.close();
                        }
                    };
                }
            }
        });
    }

    private onMention(props: SuggestionProps): void {
        this.triggerMentionEvent(props);
        this.mentionListBox?.onMention(props);
    }

    private triggerMentionEvent(props: SuggestionProps): void {
        const character = props.text.slice(0, 1);
        const searchText = props.query;
        const validMentionElement = this.mentionElements.find(
            mention => mention.mentionInternals.validConfiguration
                && mention.mentionInternals.character === character
        );
        validMentionElement?.onMention(searchText);
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

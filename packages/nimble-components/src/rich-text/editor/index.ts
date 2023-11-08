import { observable, attr, DOM, Observable, Notifier, ViewTemplate } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement,
} from '@microsoft/fast-foundation';
import {
    keyEnter,
    keySpace,
} from '@microsoft/fast-web-utilities';
import {
    Editor,
    findParentNode,
    isList,
    AnyExtension,
    Extension,
    Mark,
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
import Mention from '@tiptap/extension-mention';
import type { SuggestionProps } from '@tiptap/suggestion';
import HardBreak from '@tiptap/extension-hard-break';
import { Slice, Fragment, Node } from 'prosemirror-model';
import { template } from './template';
import { styles } from './styles';
import type { ToggleButton } from '../../toggle-button';
import { TipTapNodeName } from './types';
import type { ErrorPattern } from '../../patterns/error/types';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichTextMarkdownSerializer } from '../models/markdown-serializer';
import { anchorTag } from '../../anchor';
import type { AnchoredRegion } from '../../anchored-region';
import type { Button } from '../../button';
import { richTextMentionUsersViewTag } from '../mention-view/user-mention-view';
import type { MentionBox } from './nimble-rich-text-mention-list-box';
import { RichtextMentionUsers } from '../../rich-text-mention/mention-users';
import type { ListOption } from '../../list-option';
import type { RichTextMention } from '../../rich-text-mention/base';
import type { RichTextMentionConfig } from '../../rich-text-mention/mention-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
}

export interface MentionDetail {
    id: string;
    name: string;
}

/**
 * A nimble styled rich text editor
 */
export class RichTextEditor extends FoundationElement implements ErrorPattern {
    /**
     * @internal
     */
    public editor = this.createEditor();

    /**
     * @internal
     */
    public tiptapEditor = this.createTiptapEditor();

    /** @internal */
    @observable
    public userList: ViewTemplate<ListOption>[] = [];

    /** @internal */
    @observable
    public userListMap!: RichTextMentionConfig;

    /** @internal */
    @observable
    public pattern!: string;

    public mentionList: RichTextMention[] = [];

    /**
     * @internal
     * */
    public userListNotifiers: Notifier[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

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
        // However, the expectation is to return true if the editor is empty or contains only whitespace.
        // Hence, by retrieving the current text content using Tiptap state docs and then trimming the string to determine whether it is empty or not.
        if (this.tiptapEditor.state.doc.toString().includes('mention')) {
            return this.tiptapEditor.isEmpty;
        }
        return this.tiptapEditor.state.doc.textContent.trim().length === 0;
    }

    /**
     * Get the mentioned users in a list.
     * @public
     */
    public get mentionedUsers(): string[] {
        return RichTextMarkdownSerializer.getMentionedUser(this.tiptapEditor.state.doc);
    }

    /**
     * @internal
     */
    @observable
    public filter!: string;

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
     * @internal
     */
    @observable
    public atMentionButton!: Button;

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
    public region?: AnchoredRegion;

    /**
     * @internal
     */
    @observable
    public controlWrapper!: HTMLDivElement;

    /**
     * @internal
     */
    @observable
    public open?: boolean;

    /**
     * @internal
     */
    public editorContainer!: HTMLDivElement;

    /**
     * @internal
     */
    public mentionhrefsInPasteNodes: string[] = [];

    /**
     * @internal
     */
    public mentionBox!: MentionBox;

    private resizeObserver?: ResizeObserver;
    private mentionPropCommand!: SuggestionProps;
    private updateScrollbarWidthQueued = false;

    private readonly xmlSerializer = new XMLSerializer();
    private readonly validAbsoluteLinkRegex = /^https?:\/\//i;

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

    public childItemsChanged(): void {
        void this.updateColumnsFromChildItems();
    }

    public async updateColumnsFromChildItems(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.mentionList = this.childItems.filter(
            (x): x is RichtextMentionUsers => x instanceof RichtextMentionUsers
        );
        for (const mention of this.mentionList) {
            const notifier = Observable.getNotifier(mention);
            notifier.subscribe(this);
            this.userListNotifiers.push(notifier);
            const notifierInternals = Observable.getNotifier(
                mention.mentionInternals
            );
            notifierInternals.subscribe(this);
            this.userListNotifiers.push(notifierInternals);
        }
        this.userList = [];
        this.mentionList.forEach((list => {
            this.userList = list.getListOptions();
            this.userListMap = list.mentionInternals.mentionConfig as RichTextMentionConfig;
            this.pattern = list.pattern;
        }));
    }

    /** @internal */
    public handleChange(_source: unknown, _args: unknown): void {
        this.mentionList.forEach((list => {
            if (list instanceof RichtextMentionUsers) {
                this.userList = list.getListOptions();
                this.userListMap = list.mentionInternals.mentionConfig as unknown as RichTextMentionConfig;
                this.pattern = list.pattern;
            }
        }));
        const markdown = this.getMarkdown();
        this.setMarkdown(markdown);
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
    public placeholderChanged(): void {
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
    public ariaLabelChanged(): void {
        if (this.ariaLabel !== null && this.ariaLabel !== undefined) {
            this.editor.setAttribute('aria-label', this.ariaLabel);
        } else {
            this.editor.removeAttribute('aria-label');
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
     * Insert @ character to the editor
     * @internal
     */
    public atMentionButtonClick(): void {
        this.tiptapEditor.chain().insertContent(' @').focus().run();
    }

    public atMentionButtonKeyDown(event: KeyboardEvent): boolean {
        if (this.keyActivatesButton(event)) {
            this.tiptapEditor.chain().insertContent(' @').focus().run();
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
        // eslint-disable-next-line no-console
        console.log(RichTextMarkdownSerializer.serializeDOMToMarkdown(
            this.tiptapEditor.state.doc
        ));
        return RichTextMarkdownSerializer.serializeDOMToMarkdown(
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

    public mentionChange(e: CustomEvent<MentionDetail>): void {
        this.mentionPropCommand.command({
            href: e.detail.id,
            label: e.detail.name
        });
        this.open = false;
    }

    private createEditor(): HTMLDivElement {
        const editor = document.createElement('div');
        editor.className = 'editor';
        editor.setAttribute('aria-multiline', 'true');
        editor.setAttribute('role', 'textbox');
        editor.setAttribute('aria-disabled', 'false');
        return editor;
    }

    /**
     * This method finds the Link mark in the pasted content and update its Text node.
     * If there is no text node, pass the node's fragment recursively and updates only node containing Link mark.
     * If the Text node does not contains Link mark, push the same node to `updatedNodes`.
     *
     * @param fragment Fragment containing the pasted content. [Fragment](https://prosemirror.net/docs/ref/#model.Fragment)
     * @returns modified fragment from the `updatedNode` after updating the valid link text with its href value.
     */
    private readonly updateLinkNodes = (fragment: Fragment): Fragment => {
        const updatedNodes: Node[] = [];

        fragment.forEach(node => {
            if (node.isText && node.marks.length > 0) {
                const linkMark = node.marks.find(
                    mark => mark.type.name === 'link' && mark.attrs
                );
                if (linkMark) {
                    // Checks if the link is valid link or not
                    // Needing to separately validate the link on paste is a workaround for a tiptap issue
                    // See: https://github.com/ni/nimble/issues/1527
                    if (
                        this.validAbsoluteLinkRegex.test(
                            linkMark.attrs.href as string
                        )
                    ) {
                        // The below lines of code is responsible for updating the text content with its href value and creates a new updated text node.
                        // This code needs an update when the hyperlink support is added.
                        // See: https://github.com/ni/nimble/issues/1527
                        updatedNodes.push(
                            this.tiptapEditor.schema.text(
                                linkMark.attrs.href as string,
                                node.marks
                            )
                        );
                    } else {
                        // If it is a invalid link, creates a new Text node with the same text content and without a Link mark.
                        updatedNodes.push(
                            this.tiptapEditor.schema.text(
                                node.textContent,
                                linkMark.removeFromSet(node.marks)
                            )
                        );
                    }
                } else {
                    updatedNodes.push(node);
                }
            } else if (node.type.name === 'mention') {
                const href = node.attrs.href as string;
                let attrs: { href: string | null };
                const linkMark = this.tiptapEditor.schema.marks.link!;
                this.mentionhrefsInPasteNodes.push(href);

                if (this.validAbsoluteLinkRegex.test(href)) {
                    attrs = { href };
                } else {
                    attrs = { href: null };
                }

                updatedNodes.push(
                    this.tiptapEditor.schema.text(
                        `${href}`,
                        [linkMark.create(attrs)]
                    )
                );
                updatedNodes.push(
                    this.tiptapEditor.schema.text(' ')
                );
            } else {
                const updatedContent = this.updateLinkNodes(node.content);
                updatedNodes.push(node.copy(updatedContent));
            }
        });

        return Fragment.fromArray(updatedNodes);
    };

    /**
     * Modify the user list according to the filter and adjust the anchored region based on the
     * presence of a decoration Node (Span node where the @mention is located)
     */
    private readonly updateUserLists = (props: SuggestionProps): void => {
        this.mentionPropCommand = props;
        this.open = true;
        const twoWhiteSpaceRegex = /\s{2,}$/;
        if (props.query && twoWhiteSpaceRegex.test(props.query)) {
            this.open = false;
            return;
        }
        this.filter = props.query.toLowerCase();
        if (this.region) {
            this.region.anchorElement = props.decorationNode as HTMLElement;
            this.region.update();
        }
    };

    private createTiptapEditor(): Editor {
        const customLink = this.getCustomLinkExtension();

        /**
         * @param slice contains the Fragment of the copied content. If the content is a link, the slice contains Text node with Link mark.
         * ProseMirror reference for `transformPasted`: https://prosemirror.net/docs/ref/#view.EditorProps.transformPasted
         */
        const transformPasted = (slice: Slice): Slice => {
            this.mentionhrefsInPasteNodes = [];
            const modifiedFragment = this.updateLinkNodes(slice.content);
            if (this.mentionhrefsInPasteNodes.length > 0) {
                this.$emit('mention');
            }
            return new Slice(modifiedFragment, slice.openStart, slice.openEnd);
        };

        /**
         * For more information on the extensions for the supported formatting options, refer to the links below.
         * Tiptap marks: https://tiptap.dev/api/marks
         * Tiptap nodes: https://tiptap.dev/api/nodes
         */
        return new Editor({
            element: this.editor,
            // The editor will detect markdown syntax for an input only for these items
            // https://tiptap.dev/api/editor#enable-input-rules
            enableInputRules: [BulletList, OrderedList],
            // The editor will not detect markdown syntax when pasting content in any supported items
            // Lists do not have any default paste rules, they have only input rules, so disabled paste rules
            // https://tiptap.dev/api/editor#enable-paste-rules
            enablePasteRules: false,
            editorProps: {
                // Validating whether the links in the pasted content belongs to the supported scheme (HTTPS/HTTP),
                // and rendering it as a link in the editor. If not, rendering it as a plain text.
                // Also, updating the link text content with its href as we support only the absolute link.

                // `transformPasted` can be updated/removed when hyperlink support added
                // See: https://github.com/ni/nimble/issues/1527
                transformPasted
            },
            extensions: [
                Document,
                Paragraph,
                Text,
                BulletList,
                OrderedList,
                ListItem,
                Bold,
                Italic,
                History,
                Placeholder.configure({
                    placeholder: '',
                    showOnlyWhenEditable: false
                }),
                Mention
                    .extend({
                        parseHTML() {
                            return [
                                {
                                    tag: richTextMentionUsersViewTag
                                },
                                {
                                    tag: `span[mention-type="${this.name}"]`
                                }
                            ];
                        },
                        addAttributes() {
                            return {
                                href: {
                                    default: null,
                                    parseHTML: element => element.getAttribute('mention-href'),
                                    renderHTML: attributes => {
                                        if (!attributes.href) {
                                            return {};
                                        }

                                        return {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                            'mention-href': attributes.href,
                                        };
                                    },
                                },

                                label: {
                                    default: null,
                                    parseHTML: element => element.getAttribute('mention-label'),
                                    renderHTML: attributes => {
                                        if (!attributes.label) {
                                            return {};
                                        }

                                        return {
                                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                            'mention-label': attributes.label,
                                        };
                                    },
                                },
                            };
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        renderHTML({ node, HTMLAttributes }) {
                            return [
                                richTextMentionUsersViewTag,
                                mergeAttributes(
                                    this.options.HTMLAttributes,
                                    HTMLAttributes,
                                    { 'view-mode': true }
                                ),
                                `${this.options.renderLabel({
                                    options: this.options,
                                    node
                                })} `
                            ];
                        }
                    })
                    .configure({
                        renderLabel({ options, node }) {
                            return `${options.suggestion.char!}${(node.attrs.label as string) ?? node.attrs.id
                            }`;
                        },
                        // eslint-disable-next-line @typescript-eslint/naming-convention
                        // HTMLAttributes: {
                        //     contenteditable: true
                        // },
                        suggestion: {
                            decorationTag: richTextMentionUsersViewTag,
                            allowSpaces: true,
                            render: () => {
                                return {
                                    onStart: (props): void => {
                                        this.updateUserLists(props);
                                        this.mentionBox.selectFirstListOption();
                                    },

                                    onUpdate: (props): void => {
                                        this.updateUserLists(props);
                                    },

                                    onKeyDown: (props): boolean => {
                                        if (!this.open) {
                                            return false;
                                        }
                                        if (props.event.key === 'Escape') {
                                            this.open = false;
                                            return false;
                                        }
                                        return this.mentionBox.keydownHandler(props.event);
                                    },

                                    onExit: (): void => {
                                        this.open = false;
                                    }
                                };
                            }
                        }
                    }),
                HardBreak,
                customLink.configure({
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
                })
            ]
        });
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
        });
    }

    /**
     * This function takes the Fragment from parseMarkdownToDOM function and return the serialized string using XMLSerializer
     */
    private getHtmlContent(markdown: string): string {
        // this.mentionList[0].mentionInternals.mentionConfig.mappingConfigs
        const documentFragment = RichTextMarkdownParser.parseMarkdownToDOM(
            markdown,
            this.userListMap,
            this.pattern
        );
        return this.xmlSerializer.serializeToString(documentFragment);
        // return '';
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
        let existingMentionedUSers: string[] = [];
        this.tiptapEditor.on('update', () => {
            this.$emit('input');
            if (this.mentionhrefsInPasteNodes.length > 0 && this.mentionhrefsInPasteNodes !== existingMentionedUSers) {
                const markdown = this.getMarkdown();
                this.setMarkdown(markdown);
            }
            existingMentionedUSers = this.mentionhrefsInPasteNodes;
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
        this.tiptapEditor.view.dom.removeEventListener('input', () => { });
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
export interface RichTextEditor extends ARIAGlobalStatesAndProperties { }
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

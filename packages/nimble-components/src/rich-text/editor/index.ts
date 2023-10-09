import { observable, attr, DOM, Observable } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement,
    isListboxOption,
} from '@microsoft/fast-foundation';
import { keyArrowDown, keyArrowUp, keyEnter, keySpace, limit, uniqueId, keyTab, keyEscape } from '@microsoft/fast-web-utilities';
import {
    Editor,
    findParentNode,
    isList,
    AnyExtension,
    Extension,
    Mark
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
import type { ListOption } from '../../list-option';
import type { AnchoredRegion } from '../../anchored-region';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-editor': RichTextEditor;
    }
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
        return this.tiptapEditor.state.doc.textContent.trim().length === 0;
    }

    /**
     * @internal
     */
    @observable
    public slottedOptions!: ListOption[];

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

    private _options: ListOption[] = [];

    @observable
    private selectedIndex = 0;

    @observable
    private selectedOptions: ListOption[] = [];

    private filteredOptions: ListOption[] = [];

    private resizeObserver?: ResizeObserver;
    private mentionPropCommand!: SuggestionProps;
    private updateScrollbarWidthQueued = false;

    private readonly xmlSerializer = new XMLSerializer();
    private richTextMarkdownParser = new RichTextMarkdownParser();
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

    public slottedOptionsChanged(_prev: Element[], next: Element[]): void {
        this.options = next.reduce<ListOption[]>((options, item) => {
            if (isListboxOption(item)) {
                options.push(item);
            }
            return options;
        }, []);
        const setSize = `${this.options.length}`;
        this.options.forEach((option, index) => {
            if (!option.id) {
                option.id = uniqueId('option-');
            }
            option.ariaPosInSet = `${index + 1}`;
            option.ariaSetSize = setSize;
        });
        this.richTextMarkdownParser = new RichTextMarkdownParser([
            { id: '1234', name: 'Aagash' },
            { id: '5678', name: 'Vivin' },
        ]);
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
    public selectedOptionsChanged(
        _prev: ListOption[] | undefined,
        next: ListOption[]
    ): void {
        if (this.$fastController.isConnected) {
            this._options.forEach(o => {
                o.selected = next.includes(o);
            });
        }
    }

    public selectedIndexChanged(prev: number | undefined, next: number): void {
        if (this.$fastController.isConnected) {
            const nextIndex = limit(-1, this.options.length - 1, next);

            if (nextIndex !== this.selectedIndex) {
                this.selectedIndex = nextIndex;
                return;
            }

            if (!this.hasSelectableOptions) {
                this.selectedIndex = -1;
                return;
            }

            if (this.options[this.selectedIndex]?.disabled && typeof prev === 'number') {
                const selectableIndex = this.getSelectableIndex(prev, nextIndex);
                const newNext = selectableIndex > -1 ? selectableIndex : prev;
                this.selectedIndex = newNext;
                if (nextIndex === newNext) {
                    this.selectedIndexChanged(nextIndex, newNext);
                }
                return;
            }

            this.setSelectedOptions();
        }
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

    public clickHandler(e: MouseEvent): boolean {
        if (this.disabled) {
            return false;
        }

        if (this.open) {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            const captured = (e.target as HTMLElement).closest(
                'option,[role=option]'
            ) as ListOption | null;

            if (!captured || captured.disabled) {
                return false;
            }
            this.mentionPropCommand.command({ id: captured.value, label: captured.textContent });
            return true;
        }
        return false;
    }

    public keydownHandler(e: Event & KeyboardEvent): boolean {
        const key = e.key;
        if (key === keyTab) {
            if (!this.open) {
                return true;
            }
            if (this.firstSelectedOption) {
                this.mentionPropCommand.command({ id: this.firstSelectedOption?.value, label: this.firstSelectedOption?.textContent });
            }
            e.preventDefault();
            this.open = false;
        }
        return true;
    }

    private get options(): ListOption[] {
        Observable.track(this, 'options');
        return this.filteredOptions?.length ? this.filteredOptions : this._options;
    }

    private set options(value: ListOption[]) {
        this._options = value;
        Observable.notify(this, 'options');
    }

    private get firstSelectedOption(): ListOption | null {
        return this.selectedOptions[0] ?? null;
    }

    private get hasSelectableOptions(): boolean {
        return this.options?.length > 0 && !this.options?.every(o => o.disabled);
    }

    private setSelectedOptions(): void {
        if (this.options?.length) {
            this.selectedOptions = [this.options[this.selectedIndex]!];
            // this.ariaActiveDescendant = this.firstSelectedOption?.id ?? '';
            // this.focusAndScrollOptionIntoView();
        }
    }

    private getSelectableIndex(prev: number = this.selectedIndex, next: number): number {
        // eslint-disable-next-line no-nested-ternary
        const direction = prev > next ? -1 : prev < next ? 1 : 0;
        const potentialDirection = prev + direction;

        let nextSelectableOption!: ListOption;

        switch (direction) {
            case -1: {
                nextSelectableOption = this.options.reduceRight(
                    (previousValue, thisOption, index) => (!previousValue
                        && !thisOption.disabled
                        && index < potentialDirection
                        ? thisOption
                        : previousValue),
                    nextSelectableOption
                );
                break;
            }

            case 1: {
                nextSelectableOption = this.options.reduce(
                    (previousValue, thisOption, index) => (!previousValue
                        && !thisOption.disabled
                        && index > potentialDirection
                        ? thisOption
                        : previousValue),
                    nextSelectableOption
                );
                break;
            }
            default: {
                break;
            }
        }

        return this.options.indexOf(nextSelectableOption);
    }

    /**
     * Moves focus to the next selectable option.
     *
     * @internal
     */
    private selectNextOption(): void {
        if (!this.disabled && this.selectedIndex < this.options.length - 1) {
            this.selectedIndex += 1;
        }
    }

    /**
     * Moves focus to the previous selectable option.
     *
     * @internal
     */
    private selectPreviousOption(): void {
        if (!this.disabled && this.selectedIndex > 0) {
            this.selectedIndex -= 1;
        }
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
            } else {
                const updatedContent = this.updateLinkNodes(node.content);
                updatedNodes.push(node.copy(updatedContent));
            }
        });

        return Fragment.fromArray(updatedNodes);
    };

    private readonly updateUserLists = (props: SuggestionProps): void => {
        this.mentionPropCommand = props;
        this.open = true;
        const filter = props.text.slice(1).toLowerCase();
        this.filteredOptions = this._options.filter(ele => ele.text.toLowerCase().startsWith(filter));
        if (!this.filteredOptions.length && !filter) {
            this.filteredOptions = this._options;
        }
        this._options.forEach(o => {
            o.hidden = !this.filteredOptions.includes(o);
        });
        if (this.filteredOptions.length) {
            this.selectedOptions = [this.filteredOptions[0]!];
            this.selectedIndex = this.options.indexOf(this.firstSelectedOption!);
        } else {
            this.selectedIndex = -1;
        }
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
            const modifiedFragment = this.updateLinkNodes(slice.content);
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
                Mention.configure({
                    renderLabel({ options, node }) {
                        return `${options.suggestion.char!}${node.attrs.label as string ?? node.attrs.id}`;
                    },
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    // HTMLAttributes: { contentEditable: false },
                    suggestion: {
                        char: '@',
                        render: () => {
                            return {
                                onStart: (props): void => {
                                    this.updateUserLists(props);
                                },

                                onUpdate: (props): void => {
                                    this.updateUserLists(props);
                                },

                                onKeyDown: (props): boolean => {
                                    const key = props.event.key;
                                    if (!this.open) {
                                        return false;
                                    }
                                    switch (key) {
                                        case keyEnter: {
                                            if (this.firstSelectedOption) {
                                                this.mentionPropCommand.command({ id: this.firstSelectedOption?.value, label: this.firstSelectedOption?.textContent });
                                            }
                                            this.open = false;
                                            return true;
                                        }

                                        case keyEscape: {
                                            this.open = false;
                                            return true;
                                        }
                                        // Select the next selectable option
                                        case keyArrowDown: {
                                            if (!props.event.shiftKey) {
                                                this.selectNextOption();
                                            }
                                            return true;
                                        }

                                        // Select the previous selectable option
                                        case keyArrowUp: {
                                            if (!props.event.shiftKey) {
                                                this.selectPreviousOption();
                                            }
                                            return true;
                                        }

                                        default: {
                                            return false;
                                        }
                                    }
                                },

                                onExit: (): void => {
                                    this.open = false;
                                },
                            };
                        },
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
        const documentFragment = this.richTextMarkdownParser.parseMarkdownToDOM(markdown);
        return this.xmlSerializer.serializeToString(documentFragment);
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

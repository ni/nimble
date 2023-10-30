import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import { RichTextEnumMention, UserInfo } from '../editor/enum-text';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-viewer': RichTextViewer;
    }
}

/**
 * A nimble styled rich text viewer
 */
export class RichTextViewer extends FoundationElement {
    /**
     *
     * @public
     * Markdown string to render its corresponding rich text content in the component.
     */
    @observable
    public markdown = '';

    /**
     * @internal
     */
    public viewer!: HTMLDivElement;

    /**
     * @internal
     * */
    public userListNotifiers: Notifier[] = [];

    public mentionList: RichTextEnumMention[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    @observable
    public userList!: UserInfo[];

    @observable
    public pattern!: string;

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateView();
    }

    /**
     * @internal
     */
    public markdownChanged(): void {
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    /**
     * @internal
     */
    public childItemsChanged(): void {
        void this.updateColumnsFromChildItems();
    }

    public async updateColumnsFromChildItems(): Promise<void> {
        const definedElements = this.childItems.map(async item => (item.matches(':not(:defined)')
            ? customElements.whenDefined(item.localName)
            : Promise.resolve()));
        await Promise.all(definedElements);
        this.mentionList = this.childItems.filter(
            (x): x is RichTextEnumMention => x instanceof RichTextEnumMention
        );
        for (const column of this.mentionList) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.userListNotifiers.push(notifier);
        }
        this.userList = [];
        this.mentionList.forEach((list => {
            this.userList = list.userInternals;
            this.pattern = list.pattern;
        }));
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    /** @internal */
    public handleChange(_source: unknown, _args: unknown): void {
        this.mentionList.forEach((list => {
            this.userList = list.userInternals;
            this.pattern = list.pattern;
        }));
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    private updateView(): void {
        if (this.markdown) {
            const serializedContent = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.userList,
                this.pattern
            );
            this.viewer.replaceChildren(serializedContent);
        } else {
            this.viewer.innerHTML = '';
        }
    }
}

const nimbleRichTextViewer = RichTextViewer.compose({
    baseName: 'rich-text-viewer',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleRichTextViewer());
export const richTextViewerTag = DesignSystem.tagFor(RichTextViewer);

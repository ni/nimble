import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { Notifier, Observable, observable } from '@microsoft/fast-element';
import { template } from './template';
import { styles } from './styles';
import { RichTextMarkdownParser } from '../models/markdown-parser';
import type { RichTextMentionConfig } from '../../rich-text-mention/mention-base';
import { RichtextMentionUsers } from '../../rich-text-mention/mention-users';
import type { RichTextMention } from '../../rich-text-mention/base';

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

    public mentionList: RichTextMention[] = [];

    /**
     * @internal
     */
    @observable
    public readonly childItems: Element[] = [];

    /** @internal */
    @observable
    public userListMap!: RichTextMentionConfig;

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
            (x): x is RichtextMentionUsers => x instanceof RichtextMentionUsers
        );
        for (const column of this.mentionList) {
            const notifier = Observable.getNotifier(column);
            notifier.subscribe(this);
            this.userListNotifiers.push(notifier);
        }
        this.mentionList.forEach((list => {
            this.userListMap = list.mentionInternals.mentionConfig as RichTextMentionConfig;
            this.pattern = list.pattern;
        }));
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    /** @internal */
    public handleChange(_source: unknown, _args: unknown): void {
        this.mentionList.forEach((list => {
            if (list instanceof RichtextMentionUsers) {
                this.userListMap = list.mentionInternals.mentionConfig as unknown as RichTextMentionConfig;
                this.pattern = list.pattern;
            }
        }));
        if (this.$fastController.isConnected) {
            this.updateView();
        }
    }

    private updateView(): void {
        if (this.markdown) {
            const serializedContent = RichTextMarkdownParser.parseMarkdownToDOM(
                this.markdown,
                this.userListMap,
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

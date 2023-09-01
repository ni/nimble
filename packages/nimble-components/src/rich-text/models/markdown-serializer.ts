import {
    MarkdownSerializer,
    defaultMarkdownSerializer,
    MarkdownSerializerState
} from 'prosemirror-markdown';
import type { Node } from 'prosemirror-model';

/**
 * Provides markdown serializer for rich text components
 */
export class RichTextMarkdownSerializer {
    private readonly markdownSerializer: MarkdownSerializer;

    public constructor() {
        this.markdownSerializer = this.initializeMarkdownSerializerForTipTap();
    }

    public serializeDOMToMarkdown(doc: Node): string {
        return this.markdownSerializer.serialize(doc);
    }

    private initializeMarkdownSerializerForTipTap(): MarkdownSerializer {
        /**
         * orderedList Node is getting 'order' attribute which it is not present in the
         * tip-tap orderedList Node and having start instead of order, Changed it to start (nodes.attrs.start)
         * Assigned updated node in place of orderedList node from defaultMarkdownSerializer
         * https://github.com/ProseMirror/prosemirror-markdown/blob/b7c1fd2fb74c7564bfe5428c7c8141ded7ebdd9f/src/to_markdown.ts#L94C2-L101C7
         */
        const orderedListNode = function orderedList(
            state: MarkdownSerializerState,
            node: Node
        ): void {
            const start = (node.attrs.start as number) || 1;
            const maxW = String(start + node.childCount - 1).length;
            const space = state.repeat(' ', maxW + 2);
            state.renderList(node, space, i => {
                const nStr = String(start + i);
                return `${state.repeat(' ', maxW - nStr.length) + nStr}. `;
            });
        };

        /**
         * Internally Tiptap editor creates it own schema ( Nodes AND Marks ) based on the extensions ( Here Starter Kit is used for Bold, italic, orderedList and
         * bulletList extensions) and defaultMarkdownSerializer uses schema from prosemirror-markdown to serialize the markdown.
         * So, there is variations in the nodes and marks name (Eg. 'ordered_list' in prosemirror-markdown schema whereas 'orderedList' in tip tap editor schema),
         * To fix up this reassigned the respective nodes and marks with tip-tap editor schema.
         */
        const nodes = {
            bulletList: defaultMarkdownSerializer.nodes.bullet_list!,
            listItem: defaultMarkdownSerializer.nodes.list_item!,
            orderedList: orderedListNode,
            doc: defaultMarkdownSerializer.nodes.doc!,
            paragraph: defaultMarkdownSerializer.nodes.paragraph!,
            text: defaultMarkdownSerializer.nodes.text!
        };
        const marks = {
            italic: defaultMarkdownSerializer.marks.em!,
            bold: defaultMarkdownSerializer.marks.strong!
        };
        return new MarkdownSerializer(nodes, marks);
    }
}

/* eslint-disable */
import type { Node, Mark } from '@tiptap/pm/model';
import { MarkdownSerializer } from '@tiptap/pm/markdown';

/// A serializer for the [basic schema](#schema).
export const defaultMarkdownSerializerOverridden = new MarkdownSerializer(
    {
        bulletList(state, node) {
            state.renderList(
                node,
                '  ',
                () => `${node.attrs['bullet'] || '*'} `
            );
        },
        orderedList(state, node) {
            const start = node.attrs['order'] || 1;
            const maxW = String(start + node.childCount - 1).length;
            const space = state.repeat(' ', maxW + 2);
            state.renderList(node, space, (i) => {
                const nStr = String(start + i);
                return `${state.repeat(' ', maxW - nStr.length) + nStr}. `;
            });
        },
        listItem(state, node) {
            state.renderContent(node);
        },
        paragraph(state, node) {
            state.renderInline(node);
            state.closeBlock(node);
        },
        image(state, node) {
            state.write(
                `![${state.esc(node.attrs['alt'] || '')}](${node.attrs[
                    'src'
                ].replace(/[\(\)]/g, '\\$&')}${
                    node.attrs['title']
                        ? ` "${node.attrs['title'].replace(/"/g, '\\"')}"`
                        : ''
                })`
            );
        },
        hardBreak(state, node, parent, index) {
            for (let i = index + 1; i < parent.childCount; i++) {
                if (parent.child(i).type != node.type) {
                    state.write('\\\n');
                    return;
                }
            }
        },
        text(state, node) {
            state.text(node.text!);
        },
        mention(state, node) {
            state.write(`@<${node.attrs['id']}>`);
        }
    },
    {
        italic: {
            open: '*',
            close: '*',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        bold: {
            open: '**',
            close: '**',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        link: {
            open(state, mark, parent, index) {
                // state.inAutolink = isPlainURL(mark, parent, index);
                return isPlainURL(mark, parent, index) ? '<' : '[';
            },
            close(state, mark, parent, index) {
                // const { inAutolink } = state;
                // state.inAutolink = undefined;
                return undefined
                    ? '>'
                    : `](${mark.attrs['href'].replace(/[\(\)"]/g, '\\$&')}${
                          mark.attrs['title']
                              ? ` "${mark.attrs['title'].replace(/"/g, '\\"')}"`
                              : ''
                      })`;
            },
            mixable: true
        },
        code: {
            open(_state, _mark, parent, index) {
                return backticksFor(parent.child(index), -1);
            },
            close(_state, _mark, parent, index) {
                return backticksFor(parent.child(index - 1), 1);
            },
            escape: false
        },
        underline: {
            open: '<u>',
            close: '</u>',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        strike: {
            open: '~~',
            close: '~~',
            mixable: true,
            expelEnclosingWhitespace: true
        }
    }
);

function backticksFor(node: Node, side: number) {
    const ticks = /`+/g;
    let m;
    let len = 0;
    if (node.isText) {
        while ((m = ticks.exec(node.text!))) {
            len = Math.max(len, m[0]!.length);
        }
    }
    let result = len > 0 && side > 0 ? ' `' : '`';
    for (let i = 0; i < len; i++) {
        result += '`';
    }
    if (len > 0 && side < 0) {
        result += ' ';
    }
    return result;
}

function isPlainURL(link: Mark, parent: Node, index: number) {
    if (link.attrs['title'] || !/^\w+:/.test(link.attrs['href'])) {
        return false;
    }
    const content = parent.child(index);
    if (
        !content.isText ||
        content.text != link.attrs['href'] ||
        content.marks[content.marks.length - 1] != link
    ) {
        return false;
    }
    return (
        index == parent.childCount - 1 ||
        !link.isInSet(parent.child(index + 1).marks)
    );
}

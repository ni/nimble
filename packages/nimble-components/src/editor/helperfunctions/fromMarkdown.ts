/* eslint-disable */
import MarkdownIt from 'markdown-it';
import { MarkdownParser, ParseSpec } from '@tiptap/pm/markdown';
import type Token from 'markdown-it/lib/token';
import { Mark, Node, Schema, NodeType } from 'prosemirror-model';
import { modifiedSchema } from './modifiedSchema';

function maybeMerge(a: Node, b: Node): Node | void {
    if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) {
        return (a as any).withText(a.text! + b.text!);
    }
}

// class MarkdownParseState {
//     stack: {
//         type: NodeType;
//         attrs: Attrs | null;
//         content: Node[];
//         marks: readonly Mark[];
//     }[];

//     constructor(
//         readonly schema: Schema,
//         readonly tokenHandlers: {
//             [token: string]: (
//                 stat: MarkdownParseState,
//                 token: Token,
//                 tokens: Token[],
//                 i: number
//             ) => void;
//         }
//     ) {
//         this.stack = [
//             {
//                 type: schema.topNodeType,
//                 attrs: null,
//                 content: [],
//                 marks: Mark.none,
//             },
//         ];
//     }

//     top() {
//         return this.stack[this.stack.length - 1];
//     }

//     push(elt: Node) {
//         if (this.stack.length) {
//             this.top().content.push(elt);
//         }
//     }

//     // Adds the given text to the current position in the document,
//     // using the current marks as styling.
//     addText(text: string) {
//         if (!text) {
//             return;
//         }
//         const top = this.top();
//         const nodes = top.content;
//         const last = nodes[nodes.length - 1];
//         const node = this.schema.text(text, top.marks);
//         let merged;
//         if (last && (merged = maybeMerge(last, node))) {
//             nodes[nodes.length - 1] = merged;
//         } else {
//             nodes.push(node);
//         }
//     }

//     // Adds the given mark to the set of active marks.
//     openMark(mark: Mark) {
//         const top = this.top();
//         top.marks = mark.addToSet(top.marks);
//     }

//     // Removes the given mark from the set of active marks.
//     closeMark(mark: MarkType) {
//         const top = this.top();
//         top.marks = mark.removeFromSet(top.marks);
//     }

//     parseTokens(toks: Token[]) {
//         for (let i = 0; i < toks.length; i++) {
//             const tok = toks[i];
//             const handler = this.tokenHandlers[tok.type];
//             if (!handler) {
//                 throw new Error(
//                     `Token type \`${tok.type}\` not supported by Markdown parser`
//                 );
//             }
//             handler(this, tok, toks, i);
//         }
//     }

//     // Add a node at the current position.
//     addNode(type: NodeType, attrs: Attrs | null, content?: readonly Node[]) {
//         const top = this.top();
//         const node = type.createAndFill(attrs, content, top ? top.marks : []);
//         if (!node) {
//             return null;
//         }
//         this.push(node);
//         return node;
//     }

//     // Wrap subsequent content in a node of the given type.
//     openNode(type: NodeType, attrs: Attrs | null) {
//         this.stack.push({
//             type,
//             attrs,
//             content: [],
//             marks: Mark.none,
//         });
//     }

//     // Close and return the node that is currently on top of the stack.
//     closeNode() {
//         const info = this.stack.pop()!;
//         return this.addNode(info.type, info.attrs, info.content);
//     }
// }

function attrs(spec: ParseSpec, token: Token, tokens: Token[], i: number) {
    if (spec.getAttrs) {
        return spec.getAttrs(token, tokens, i);
    }
    // For backwards compatibility when `attrs` is a Function
    if (spec.attrs instanceof Function) {
        return spec.attrs(token);
    }
    return spec.attrs;
}

// Code content is represented as a single token with a `content`
// property in Markdown-it.
function noCloseToken(spec: ParseSpec, type: string) {
    return (
        spec.noCloseToken ||
        type == 'code_inline' ||
        type == 'code_block' ||
        type == 'fence'
    );
}

function withoutTrailingNewline(str: string) {
    return str.endsWith('\n') ? str.slice(0, str.length - 1) : str;
}

function getNodeType(schema: Schema, str: string): NodeType | void {
    if (str === 'paragraph') {
        return schema.nodes['paragraph'];
    }
    if (str === 'list_item') {
        return schema.nodes['list_item'];
    }
    if (str === 'bullet_list') {
        return schema.nodes['bullet_list'];
    }
    if (str === 'ordered_list') {
        return schema.nodes['ordered_list'];
    }
    if (str === 'heading') {
        return schema.nodes['heading'];
    }
    if (str === 'image') {
        return schema.nodes['image'];
    }
    if (str === 'hard_break') {
        return schema.nodes['hard_break'];
    }
    if (str === 'mention') {
        return schema.nodes['mention'];
    }
}

function noOp() {}

function tokenHandlers(schema: Schema, tokens: { [token: string]: ParseSpec }) {
    const handlers: {
        [token: string]: (
            stat: any,
            token: Token,
            tokens: Token[],
            i: number
        ) => void;
    } = Object.create(null);
    for (const type in tokens) {
        const spec = tokens[type]!;
        if (spec.block) {
            const nodeType = getNodeType(schema, spec.block)!;
            if (noCloseToken(spec, type)) {
                handlers[type] = (state, tok, tokens, i) => {
                    state.openNode(nodeType, attrs(spec, tok, tokens, i));
                    state.addText(withoutTrailingNewline(tok.content));
                    state.closeNode();
                };
            } else {
                handlers[`${type}_open`] = (state, tok, tokens, i) =>
                    state.openNode(nodeType, attrs(spec, tok, tokens, i));
                handlers[`${type}_close`] = (state) => state.closeNode();
            }
        } else if (spec.node) {
            const nodeType = getNodeType(schema, spec.node);
            if (nodeType === schema.nodes['mention']) {
                handlers[`${type}_open`] = (state, tok, tokens, i) =>
                    state.openNode(nodeType, attrs(spec, tok, tokens, i));
                handlers[`${type}_close`] = (state) => state.closeNode();
            } else {
                handlers[type] = (state, tok, tokens, i) =>
                    state.addNode(nodeType!, attrs(spec, tok, tokens, i));
            }
        } else if (spec.mark) {
            const markType = schema.marks[spec.mark]!;
            if (noCloseToken(spec, type)) {
                handlers[type] = (state, tok, tokens, i) => {
                    state.openMark(
                        markType.create(attrs(spec, tok, tokens, i))
                    );
                    state.addText(withoutTrailingNewline(tok.content));
                    state.closeMark(markType);
                };
            } else {
                handlers[`${type}_open`] = (state, tok, tokens, i) =>
                    state.openMark(
                        markType.create(attrs(spec, tok, tokens, i))
                    );
                handlers[`${type}_close`] = (state) =>
                    state.closeMark(markType);
            }
        } else if (spec.ignore) {
            if (noCloseToken(spec, type)) {
                handlers[type] = noOp;
            } else {
                handlers[`${type}_open`] = noOp;
                handlers[`${type}_close`] = noOp;
            }
        } else {
            throw new RangeError(
                `Unrecognized parsing spec ${JSON.stringify(spec)}`
            );
        }
    }

    handlers['text'] = (state, tok) => state.addText(tok.content);
    handlers['inline'] = (state, tok) => state.parseTokens(tok.children!);
    handlers['softbreak'] =
        handlers['softbreak'] || ((state) => state.addText(' '));

    return handlers;
}

function listIsTight(tokens: readonly Token[], i: number) {
    while (++i < tokens.length) {
        if (tokens[i]!.type != 'list_item_open') {
            return tokens[i]!.hidden;
        }
    }
    return false;
}

export class CustomMarkdownParser extends MarkdownParser {
    /// @internal
    tokenHandlers;
    constructor(
        schema: Schema,
        tokenizer: MarkdownIt,
        tokens: { [name: string]: ParseSpec }
    ) {
        super(schema, tokenizer, tokens);
        // Add tokenizer rules for mention node
        tokenizer.use(
            (md) => {
                md.inline.ruler.before(
                    'emphasis',
                    'mention',
                    (state, silent) => {
                        const max = state.posMax;

                        if (state.src.charCodeAt(state.pos) !== 0x40 /* @ */) {
                            return false;
                        }
                        if (
                            state.src.charCodeAt(state.pos + 1) !== 0x3c /* < */
                        ) {
                            return false;
                        }
                        let position = state.pos;
                        const userIdStart = position + 2;

                        for (; position < max; position++) {
                            if (
                                state.src.charCodeAt(position) === 0x3e /* > */
                            ) {
                                break;
                            }
                        }

                        const userIdEnd = position;
                        const userId = state.src.slice(userIdStart, userIdEnd);
                        position++;
                        state.pos = position;

                        let token = state.push('mention_open', 'span', 1);
                        token.attrs = [
                            ['dataid', userId],
                            ['datalabel', this.getUserName(userId)]
                        ];
                        token = state.push('text', '', 0);
                        token.content = '@' + this.getUserName(userId);

                        state.push('mention_close', 'span', -1);
                        return true;
                    }
                );
            },
            { prepend: true }
        );
        this.tokenHandlers = tokenHandlers(schema, tokens);

        tokenizer.use((md) => {
            md.inline.ruler.before('mention', 'underline', (state, silent) => {
                const max = state.posMax;

                if (state.src.charCodeAt(state.pos) !== 0x3c /* < */) {
                    return false;
                }
                if (state.src.charCodeAt(state.pos + 1) !== 0x75 /* u */) {
                    return false;
                }
                if (state.src.charCodeAt(state.pos + 2) !== 0x3e /* > */) {
                    return false;
                }
                let underlineStartPosition = state.pos;
                const underlineWordStart = underlineStartPosition + 3;
                underlineStartPosition++;
                for (; underlineStartPosition < max; underlineStartPosition++) {
                    if (
                        state.src.charCodeAt(underlineStartPosition) ===
                        0x3c /* < */
                    ) {
                        break;
                    }
                }
                if (
                    state.src.charCodeAt(underlineStartPosition + 1) !==
                    0x2f /* / */
                ) {
                    return false;
                }
                if (
                    state.src.charCodeAt(underlineStartPosition + 2) !==
                    0x75 /* u */
                ) {
                    return false;
                }
                if (
                    state.src.charCodeAt(underlineStartPosition + 3) !==
                    0x3e /* > */
                ) {
                    return false;
                }

                const underlineWordEnd = underlineStartPosition;
                underlineStartPosition += 3;
                const underlineWord = state.src.slice(
                    underlineWordStart,
                    underlineWordEnd
                );
                underlineStartPosition++;
                state.pos = underlineStartPosition;

                let token = state.push('underline_open', 'u', 1);

                token = state.push('text', '', 0);
                token.content = underlineWord;

                state.push('underline_close', 'u', -1);
                return true;
            });
        });

        tokenizer.use((md) => {
            md.inline.ruler.before(
                'mention',
                'strikethrough',
                (state, silent) => {
                    const max = state.posMax;

                    if (state.src.charCodeAt(state.pos) !== 0x7e /* ~ */) {
                        return false;
                    }
                    if (state.src.charCodeAt(state.pos + 1) !== 0x7e /* ~ */) {
                        return false;
                    }
                    let strikethroughStartPosition = state.pos;
                    const strikethroughWordStart =
                        strikethroughStartPosition + 2;
                    strikethroughStartPosition += 2;
                    for (
                        ;
                        strikethroughStartPosition < max;
                        strikethroughStartPosition++
                    ) {
                        if (
                            state.src.charCodeAt(strikethroughStartPosition) ===
                            0x7e /* ~ */
                        ) {
                            break;
                        }
                    }
                    if (
                        state.src.charCodeAt(strikethroughStartPosition + 1) !==
                        0x7e /* /~ */
                    ) {
                        return false;
                    }

                    const strikethoroughWordEnd = strikethroughStartPosition;
                    strikethroughStartPosition += 2;
                    const strikethroughWord = state.src.slice(
                        strikethroughWordStart,
                        strikethoroughWordEnd
                    );
                    strikethroughStartPosition++;
                    state.pos = strikethroughStartPosition;

                    let token = state.push('strikethrough_open', 's', 1);

                    token = state.push('text', '', 0);
                    token.content = strikethroughWord;

                    state.push('strikethrough_close', 's', -1);
                    return true;
                }
            );
        });
    }

    private readonly usersList = {
        users: [
            { id: '1234-5678', name: 'Lea Thompson' },
            { id: '1243-5678', name: 'Cyndi Lauper' },
            { id: '1342-5678', name: 'Tom Cruise' },
            { id: '1324-5678', name: 'Madonna' },
            { id: '1423-5678', name: 'Jerry Hall' },
            { id: '2341-5678', name: 'Joan Collins' },
            { id: '2314-5678', name: 'Winona Ryder' },
            { id: '2413-5678', name: 'Christina Applegate' },
            { id: '2431-5678', name: 'Alyssa Milano' },
            { id: '3412-5678', name: 'Molly Ringwald' },
            { id: '3421-5678', name: 'Ally Sheedy' },
            { id: '3241-5678', name: 'Debbie' },
            { id: '3214-5678', name: 'Olivia Newton-John' },
            { id: '3124-5678', name: 'Elton John' },
            { id: '3142-5678', name: 'Michael J. Fox' },
            { id: '1234-5687', name: 'Axl Rose' },
            { id: '1234-5768', name: 'Emilio Estevez' },
            { id: '1234-5786', name: 'Ralph Macchio' },
            { id: '1234-5876', name: 'Rob Lowe' },
            { id: '1234-5867', name: 'Jennifer Grey' },
            { id: '1234-6785', name: 'Mickey Rourke' },
            { id: '1234-6758', name: 'John Cusack' },
            { id: '1234-6578', name: 'Matthew Broderick' },
            { id: '1234-7856', name: 'Justine Bateman' },
            { id: '1432-5678', name: 'Lisa Bonet' }
        ]
    };

    getUserName(userId: string) {
        return (
            this.usersList.users.find((user) => user.id === userId)?.name ?? ''
        );
    }
}

export const defaultMarkdownParserOverridden = new CustomMarkdownParser(
    modifiedSchema,
    MarkdownIt('commonmark', { html: false }),
    {
        // blockquote: { block: 'blockquote' },
        paragraph: { block: 'paragraph' },
        list_item: { block: 'list_item' },
        bullet_list: {
            block: 'bullet_list',
            getAttrs: (_, tokens, i) => ({ tight: listIsTight(tokens, i) })
        },
        ordered_list: {
            block: 'ordered_list',
            getAttrs: (tok, tokens, i) => ({
                order: +tok.attrGet('start')! || 1,
                tight: listIsTight(tokens, i)
            })
        },
        // heading: {
        //     block: 'heading',
        //     getAttrs: (tok) => ({ level: +tok.tag.slice(1) }),
        // },
        // code_block: { block: 'code_block', noCloseToken: true },
        // fence: {
        //     block: 'code_block',
        //     getAttrs: (tok) => ({ params: tok.info || '' }),
        //     noCloseToken: true,
        // },
        // hr: { node: 'horizontal_rule' },
        image: {
            node: 'image',
            getAttrs: (tok) => ({
                src: tok.attrGet('src'),
                title: tok.attrGet('title') || null,
                alt: (tok.children![0] && tok.children![0].content) || null
            })
        },
        hardbreak: { node: 'hard_break' },
        mention: {
            node: 'mention',
            getAttrs: (tok) => ({
                dataid: tok.attrGet('dataid'),
                datalabel: tok.attrGet('datalabel')
            })
        },

        em: { mark: 'em' },
        strong: { mark: 'strong' },
        link: {
            mark: 'link',
            getAttrs: (tok) => ({
                href: tok.attrGet('href'),
                title: tok.attrGet('title') || null
            })
        },
        code_inline: { mark: 'code', noCloseToken: true },
        strikethrough: { mark: 'strikethrough' },
        underline: { mark: 'underline' }
    }
);

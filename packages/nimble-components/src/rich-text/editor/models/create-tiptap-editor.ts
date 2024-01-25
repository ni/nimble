import { Editor, Mark, Node, mergeAttributes } from '@tiptap/core';
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
import Text from '@tiptap/extension-text';
import Mention, { MentionOptions } from '@tiptap/extension-mention';
import HardBreak from '@tiptap/extension-hard-break';
import { Slice, Fragment, Node as FragmentNode } from 'prosemirror-model';
import { PluginKey } from 'prosemirror-state';

import { keyEscape } from '@microsoft/fast-web-utilities';
import {
    ActiveMentionCommandEmitter,
    ActiveMentionCharacterEmitter,
    mentionPluginPrefix
} from '../types';

import { anchorTag } from '../../../anchor';
import type { MentionExtensionConfiguration } from '../../models/mention-extension-configuration';
import type { RichTextMentionListbox } from '../../mention-listbox';

const validAbsoluteLinkRegex = /^https?:\/\//i;

export function createTiptapEditor(
    activeMentionCharacterEmitter: ActiveMentionCharacterEmitter,
    activeMentionCommandEmitter: ActiveMentionCommandEmitter,
    editor: HTMLDivElement,
    mentionExtensionConfig: MentionExtensionConfiguration[],
    mentionListbox?: RichTextMentionListbox,
    placeholder?: string
): Editor {
    const customLink = createCustomLinkExtension();
    const mentionExtensions = mentionExtensionConfig.map(config => createCustomMentionExtension(
        config,
        activeMentionCharacterEmitter,
        activeMentionCommandEmitter,
        mentionListbox
    ));

    /**
     * For more information on the extensions for the supported formatting options, refer to the links below.
     * Tiptap marks: https://tiptap.dev/api/marks
     * Tiptap nodes: https://tiptap.dev/api/nodes
     */
    const tipTapEditor = new Editor({
        element: editor,
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
                placeholder,
                showOnlyWhenEditable: false
            }),
            HardBreak,
            customLink,
            ...mentionExtensions
        ]
    });

    /**
     * @param slice contains the Fragment of the copied content. If the content is a link, the slice contains Text node with Link mark.
     * ProseMirror reference for `transformPasted`: https://prosemirror.net/docs/ref/#view.EditorProps.transformPasted
     */
    function transformPasted(slice: Slice): Slice {
        const modifiedFragment = updateLinkAndMentionNodes(
            tipTapEditor,
            slice.content
        );
        return new Slice(modifiedFragment, slice.openStart, slice.openEnd);
    }

    return tipTapEditor;
}

/**
 * Extending the default link mark schema defined in the TipTap.
 *
 * "excludes": https://prosemirror.net/docs/ref/#model.MarkSpec.excludes
 * "inclusive": https://prosemirror.net/docs/ref/#model.MarkSpec.inclusive
 * "parseHTML": https://tiptap.dev/guide/custom-extensions#parse-html
 * "renderHTML": https://tiptap.dev/guide/custom-extensions/#render-html
 */
function createCustomLinkExtension(): Mark<LinkOptions> {
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
            target: null,
            // Adding `class` here is a workaround to render two mentions without a whitespace as display names
            // This attribute can be removed when the below issue is resolved
            // https://github.com/ni/nimble/issues/1707
            class: ''
        },
        autolink: true,
        openOnClick: false,
        // linkOnPaste can be enabled when hyperlink support added
        // See: https://github.com/ni/nimble/issues/1527
        linkOnPaste: false,
        validate: href => validAbsoluteLinkRegex.test(href)
    });
}

function createCustomMentionExtension(
    config: MentionExtensionConfiguration,
    activeMentionCharacterEmitter: ActiveMentionCharacterEmitter,
    activeMentionCommandEmitter: ActiveMentionCommandEmitter,
    mentionListbox?: RichTextMentionListbox
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
                },
                disabled: {
                    default: null,
                    parseHTML: element => element.getAttribute('disabled'),
                    renderHTML: attributes => {
                        return {
                            disabled: attributes.disabled as string
                        };
                    }
                }
            };
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        renderHTML({ node, HTMLAttributes }) {
            return [
                config.viewElement,
                mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
                this.options.renderLabel({
                    options: this.options,
                    node
                })
            ];
        }
    }).configure({
        suggestion: {
            char: config.character,
            decorationClass: 'nimble-mention-view-edit',
            pluginKey: new PluginKey(config.key),
            allowSpaces: true,
            render: () => {
                let inSuggestionMode = false;
                return {
                    onStart: (props): void => {
                        /**
                         * If the cursor position moves to outside of the mention and configuration element changes,
                         * the setMarkdown() will trigger this `onStart` without a decoration node because the cursor
                         * position is temporarily moved out of the suggestion decoration. Ignore `onStart` in that case
                         * and don't show the mention list box since it doesn't have anything to anchor to.
                         */
                        if (props.decorationNode === null) {
                            return;
                        }
                        inSuggestionMode = true;
                        config.mentionUpdateEmitter(props.query);
                        activeMentionCharacterEmitter(props.text.slice(0, 1));
                        activeMentionCommandEmitter(props.command);
                        mentionListbox?.show({
                            filter: props.query,
                            anchorNode: props.decorationNode as HTMLElement
                        });
                    },
                    onUpdate: (props): void => {
                        if (!inSuggestionMode) {
                            return;
                        }
                        config.mentionUpdateEmitter(props.query);
                        activeMentionCommandEmitter(props.command);
                        mentionListbox?.show({
                            filter: props.query,
                            anchorNode: props.decorationNode as HTMLElement
                        });
                    },
                    onKeyDown: (props): boolean => {
                        if (!inSuggestionMode) {
                            return false;
                        }
                        if (props.event.key === keyEscape) {
                            inSuggestionMode = false;
                        }
                        return (
                            mentionListbox?.keydownHandler(props.event) ?? false
                        );
                    },
                    onExit: (): void => {
                        activeMentionCharacterEmitter('');
                        activeMentionCommandEmitter(undefined);
                        mentionListbox?.close();
                    }
                };
            }
        }
    });
}

/**
 * This method finds the Link mark in the pasted content and update its Text node.
 * If there is no text node, pass the node's fragment recursively and updates only node containing Link mark.
 * If the Text node does not contains Link mark, push the same node to `updatedNodes`.
 *
 * @param fragment Fragment containing the pasted content. [Fragment](https://prosemirror.net/docs/ref/#model.Fragment)
 * @returns modified fragment from the `updatedNode` after updating the valid link text with its href value.
 */
function updateLinkAndMentionNodes(
    tiptapEditor: Editor,
    fragment: Fragment
): Fragment {
    const updatedNodes: FragmentNode[] = [];

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
                    validAbsoluteLinkRegex.test(linkMark.attrs.href as string)
                ) {
                    // The below lines of code is responsible for updating the text content with its href value and creates a new updated text node.
                    // This code needs an update when the hyperlink support is added.
                    // See: https://github.com/ni/nimble/issues/1527
                    updatedNodes.push(
                        tiptapEditor.schema.text(
                            linkMark.attrs.href as string,
                            node.marks
                        )
                    );
                } else {
                    // If it is a invalid link, creates a new Text node with the same text content and without a Link mark.
                    updatedNodes.push(
                        tiptapEditor.schema.text(
                            node.textContent,
                            linkMark.removeFromSet(node.marks)
                        )
                    );
                }
            } else {
                updatedNodes.push(node);
            }
        } else if (node.type.name.startsWith(mentionPluginPrefix)) {
            updatedNodes.push(
                tiptapEditor.schema.text(node.attrs.label as string)
            );
        } else {
            const updatedContent = updateLinkAndMentionNodes(
                tiptapEditor,
                node.content
            );
            updatedNodes.push(node.copy(updatedContent));
        }
    });

    return Fragment.fromArray(updatedNodes);
}

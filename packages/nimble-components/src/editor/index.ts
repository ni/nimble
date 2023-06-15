/* eslint-disable */
import {
    DesignSystem,
    Button as FoundationButton,
    FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
// import type { UserData } from './types';
import { attr, observable } from '@microsoft/fast-element';

import { Editor } from '@tiptap/core';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
// import Underline from '@tiptap/extension-underline';
// import Link from '@tiptap/extension-link';
// import Mention from '@tiptap/extension-mention';
// import tippy, { GetReferenceClientRect, Instance, Props } from 'tippy.js';
import { DOMSerializer } from '@tiptap/pm/model';
import { modifiedSchema } from './helperfunctions/modifiedSchema';
import { defaultMarkdownParserOverridden } from './helperfunctions/fromMarkdown';
import { defaultMarkdownSerializerOverridden } from './helperfunctions/toMarkdown';
// import Placeholder from '@tiptap/extension-placeholder';

export class RichTextEditor extends FoundationElement {
    @attr placeholder: string = '';
    @attr linkButtonDisabled: boolean = false;
    @attr({ mode: 'boolean' }) imageButtonDisabled: boolean = false;
    @attr({ mode: 'boolean' }) readOnly: boolean = false;
    @attr({ mode: 'boolean' }) isFocus: boolean = false;

    // @observable
    // public usersData?: UserData;

    @observable public markdownInput?: string;

    @attr({ mode: 'boolean' }) public isBold!: boolean;
    @attr({ mode: 'boolean' }) public isItalic!: boolean;
    @attr({ mode: 'boolean' }) public isLink!: boolean;
    @attr({ mode: 'boolean' }) public isBulletList!: boolean;
    @attr({ mode: 'boolean' }) public isNumberedList!: boolean;
    @attr({ mode: 'boolean' }) public isStrikeOut!: boolean;
    @attr({ mode: 'boolean' }) public isUnderline!: boolean;

    public editor: Editor | undefined;
    public dialog: any;
    public markdownContent: string = '';

    // public set users(value: UserData) {
    //     this.usersData = value;
    // }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.initializeEditor();

        this.changeEventTrigger();
    }

    public boldButtonClickHandler(): void {
        if (!this.editor!.chain().focus()) {
            this.toggleTipTapButtonState();
            return;
        }
        // this.editor!.chain().focus().toggleBold().run();
        this.toggleTipTapButtonState();
        for (let i = 0; i < 200; i++) {
            for (let j = 0; j < 9; j++) {
                this.editor!.chain()
                    .focus()
                    .insertContent({
                        type: 'mention',
                        attrs: {
                            id: `use${j}`,
                            label: `use${j}`
                        }
                    })
                    .run();
            }
        }
    }

    public italicButtonClickHandler(): void {
        if (!this.editor!.chain().focus()) {
            this.toggleTipTapButtonState();
            return;
        }
        // this.editor!.chain().focus().toggleItalic().run();
        this.toggleTipTapButtonState();
    }

    public numberedListButtonClickHandler(): void {
        if (!this.editor!.chain().focus()) {
            this.toggleTipTapButtonState();
            return;
        }
        // this.editor!.chain().focus().toggleOrderedList().run();
        this.toggleTipTapButtonState();
    }

    public bulletListButtonClickHandler(): void {
        if (!this.editor!.chain().focus()) {
            this.toggleTipTapButtonState();
            return;
        }
        // this.editor!.chain().focus().toggleBulletList().run();
        this.toggleTipTapButtonState();
    }

    public strikethroughButtonClickHandler(): void {
        if (!this.editor!.chain().focus()) {
            this.toggleTipTapButtonState();
            return;
        }
        // this.editor!.chain().focus().toggleStrike().run();
        this.toggleTipTapButtonState();
    }

    public underlineButtonClickHandler(): void {
        // if (!this.editor!.chain().focus()) {
        //     this.toggleTipTapButtonState();
        //     return;
        // }
        // this.editor!.chain().focus().toggleUnderline().run();
        // this.toggleTipTapButtonState();
    }

    public loadMarkdownButtonClickHandler(): void {
        this.loadMarkdown();
    }

    public logMarkdownButtonClickHandler(): void {
        this.markdownOutput();
    }

    public getMarkdownContent(): string {
        this.markdownContent = defaultMarkdownSerializerOverridden.serialize(
            this.editor!.view.state.doc
        );
        return this.markdownContent;
    }

    public imageUploadButtonChangeEvent(event: any): void {
        // this.imageUploaded(event);
    }

    public imageUploadButtonClickHandler(): void {
        const imageElement = this.shadowRoot?.querySelector(
            '#imageUploadInput'
        ) as HTMLInputElement;
        imageElement.click();
    }

    public addCommentButtonClickHandler(markdownInput: string): void {
        this.addComment(markdownInput);
        this.unFocusEditor();
    }

    public unFocusEditor(): void {
        this.editor?.commands.clearContent();
        this.isFocus = false;
    }

    public openDialogLink(): void {
        const dialogSetLinkInput = this.shadowRoot?.querySelector(
            '#urlInput'
        ) as any;
        dialogSetLinkInput.value =
            this.editor!.getAttributes('link')['href'] || '';
        this.dialog.show();
    }

    public dialogOkButtonClickHandler(): void {
        const dialogSetLinkInput = this.shadowRoot?.querySelector(
            '#urlInput'
        ) as any;
        this.setLink(dialogSetLinkInput?.value);
    }

    private changeEventTrigger(): void {
        this.editor?.on('update', ({ editor, transaction }) => {
            console.time('tiptap');
            const eventDetail = {
                value: defaultMarkdownSerializerOverridden.serialize(
                    this.editor!.view.state.doc
                )
            };
            // const eventDetail = {
            //     value: editor.getText()
            // }

            // this.$emit('isEmpty', eventDetail);
            this.$emit('onEditorChange', eventDetail);
        });
    }

    private setLink(url: string) {
        // if (url) {
        //     this.editor!.chain()
        //         .focus()
        //         .extendMarkRange('link')
        //         .setLink({ href: url })
        //         .run();
        // } else if (!url) {
        //     this.editor!.chain()
        //         .focus()
        //         .extendMarkRange('link')
        //         .unsetLink()
        //         .run();
        // }
        // this.dialog.close();
    }

    private initializeEditor(): void {
        const editorWindowParentElement =
            this.shadowRoot?.querySelector('#editor-window')!;
        this.editor = new Editor({
            element: editorWindowParentElement,
            editable: !this.readOnly,
            extensions: [
                // StarterKit.configure({ bold: false }),
                // Underline,
                // Image.configure({
                //     inline: true,
                //     allowBase64: true
                // }),
                // Link.configure({
                //     openOnClick: true,
                //     autolink: false
                // }),
                // Mention.configure({
                //     HTMLAttributes: {
                //         class: 'my-custom-class',
                //     },
                //     renderLabel({ options, node }) {
                //         return `${options.suggestion.char}${
                //             node.attrs['label'] ?? node.attrs['id']
                //         }`;
                //     },
                //     suggestion: {
                //         items: ({ query }) => {
                //             const userDetails = this.usersData
                //                 ? this.usersData.map((item) => {
                //                       return {
                //                           id: item.key,
                //                           name:
                //                               item.value.firstName +
                //                               ' ' +
                //                               item.value.lastName,
                //                       };
                //                   })
                //                 : [];
                //             return userDetails
                //                 .filter((item) =>
                //                     item.name
                //                         .toLowerCase()
                //                         .startsWith(query.toLowerCase())
                //                 )
                //                 .slice(0, 5);
                //         },

                //         render: () => {
                //             let popup: Instance<Props>[];
                //             let selectedIndex: number;
                //             let component =
                //                 document.createElement('nimble-menu');

                //             return {
                //                 onStart: (props) => {
                //                     props.editor.view.focus();
                //                     const items = props.items;
                //                     component.innerHTML = '';

                //                     if (items.length) {
                //                         items.forEach((item, index) => {
                //                             const nimbleMenuItem =
                //                                 document.createElement(
                //                                     'nimble-menu-item'
                //                                 );
                //                             if (index === selectedIndex) {
                //                                 nimbleMenuItem.classList.add(
                //                                     'is-selected'
                //                                 );
                //                             }
                //                             nimbleMenuItem.textContent =
                //                                 item.name;
                //                             nimbleMenuItem.addEventListener(
                //                                 'click',
                //                                 () => {
                //                                     const item =
                //                                         props.items[index];
                //                                     if (item) {
                //                                         props.editor.view.focus();
                //                                         props.command({
                //                                             id: item.id,
                //                                             label: item.name,
                //                                         });
                //                                     }
                //                                 }
                //                             );
                //                             component.appendChild(
                //                                 nimbleMenuItem
                //                             );
                //                         });
                //                     } else {
                //                         const noResult =
                //                             document.createElement('div');
                //                         noResult.classList.add('item');
                //                         noResult.textContent = 'No result';
                //                         component.appendChild(noResult);
                //                     }

                //                     if (!props.clientRect) {
                //                         return;
                //                     }
                //                     popup = tippy('body', {
                //                         getReferenceClientRect:
                //                             props.clientRect as GetReferenceClientRect,
                //                         appendTo: () =>
                //                             editorWindowParentElement,
                //                         content: component,
                //                         showOnCreate: true,
                //                         interactive: true,
                //                         trigger: 'manual',
                //                         placement: 'bottom-start',
                //                     });
                //                 },

                //                 onUpdate: (props) => {
                //                     if (props.items.length) {
                //                         component.innerHTML = '';
                //                         props.items.forEach((item, index) => {
                //                             const nimbleMenuItem =
                //                                 document.createElement(
                //                                     'nimble-menu-item'
                //                                 );
                //                             if (index === selectedIndex) {
                //                                 nimbleMenuItem.classList.add(
                //                                     'is-selected'
                //                                 );
                //                             }
                //                             nimbleMenuItem.textContent =
                //                                 item.name;
                //                             nimbleMenuItem.addEventListener(
                //                                 'click',
                //                                 () => {
                //                                     props.editor.view.focus();
                //                                     const item =
                //                                         props.items[index];
                //                                     if (item) {
                //                                         props.command({
                //                                             id: item.id,
                //                                             label: item.name,
                //                                         });
                //                                     }
                //                                 }
                //                             );
                //                             component.appendChild(
                //                                 nimbleMenuItem
                //                             );
                //                         });
                //                     } else {
                //                         component.innerHTML = '';
                //                         const noResult =
                //                             document.createElement('div');
                //                         noResult.classList.add('item');
                //                         noResult.textContent = 'No result';
                //                         component.appendChild(noResult);
                //                     }
                //                     if (!props.clientRect) {
                //                         return;
                //                     }
                //                     popup[0].setProps({
                //                         getReferenceClientRect:
                //                             props.clientRect as GetReferenceClientRect,
                //                     });
                //                 },

                //                 onKeyDown: (props) => {
                //                     if (props.event.key === 'Escape') {
                //                         popup[0].hide();
                //                         return true;
                //                     }
                //                     return false;
                //                 },

                //                 onExit: () => {
                //                     popup[0].destroy();
                //                 },
                //             };
                //         },
                //     },
                // }),
                // Placeholder.configure({
                //     placeholder: this.placeholder,
                //     emptyEditorClass: 'is-editor-empty'
                // })
            ],
            editorProps: {
                // handleDrop: function (view, event, _slice, moved) {
                //     view.focus();
                //     if (
                //         !moved &&
                //         event.dataTransfer &&
                //         event.dataTransfer.files &&
                //         event.dataTransfer.files[0]
                //     ) {
                //         let file = event.dataTransfer.files[0];
                //         let _URL = window.URL || window.webkitURL;
                //         let img = document.createElement('img');
                //         img.src = _URL.createObjectURL(file);
                //         img.onload = function () {
                //             const imageElement = document.createElement('img');
                //             imageElement.src = _URL.createObjectURL(file);
                //             const { schema } = view.state;
                //             const coordinates = view.posAtCoords({
                //                 left: event.clientX,
                //                 top: event.clientY,
                //             });
                //             const node = schema.nodes['image'].create({
                //                 src: imageElement.src,
                //             });
                //             const transaction = view.state.tr.insert(
                //                 coordinates?.pos!,
                //                 node
                //             );
                //             return view.dispatch(transaction);
                //         };
                //         return true;
                //     }
                //     return false;
                // },
                // handlePaste: function (view, event, _slice) {
                //     const items = Array.from(event.clipboardData?.items || []);
                //     for (const item of items) {
                //         if (item.type.indexOf('image') === 0) {
                //             let file = item.getAsFile();
                //             let reader = new FileReader();
                //             reader.onload = function () {
                //                 const { schema } = view.state;
                //                 const node = schema.nodes['image'].create({
                //                     src: reader.result,
                //                 });
                //                 const transaction =
                //                     view.state.tr.replaceSelectionWith(node);
                //                 view.dispatch(transaction);
                //             };
                //             reader.readAsDataURL(file!);
                //             return true;
                //         }
                //     }
                //     return false;
                // },
                handleDOMEvents: {
                    click: (view, event) => {
                        this.toggleTipTapButtonState();
                    },
                    keydown: (view, event) => {
                        this.toggleTipTapButtonState();
                        return false;
                    },
                    keypress: (view, event) => {
                        this.toggleTipTapButtonState();
                        return false;
                    },
                    keyup: (view, event) => {
                        this.toggleTipTapButtonState();
                        return false;
                    },
                    select: (view, event) => {
                        this.toggleTipTapButtonState();
                        return false;
                    },
                    focusin: (view) => {
                        this.isFocus = true;
                    }
                }
            }
        });

        this.shadowRoot?.appendChild(this.parentCommentDiv);
        this.dialog = this.shadowRoot?.querySelector('#dialog') as any;
    }

    private parentCommentDiv: HTMLElement = document.createElement('div');

    // Loads the given markdown content in editor
    private loadMarkdown() {
        const inputContent =
            'Hello @<1234-5678>, this test result passes all the **below cases successfully**!!\n\n* Point 1\n\n  * *Sub Point 1*\n\nAdditional points:\n\n1. Additional Point 1\n\n   1. ~~Additional Sub Point 1~~\n\n[Link for reference](www.google.com)\n\n![](data:image/png;base64,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)\n\n<u>Note: Tagging</u> @<2341-5678>';

        let htmlConvertedContent = '';
        const serializer = DOMSerializer.fromSchema(modifiedSchema);
        const htmlFragment = serializer.serializeFragment(
            defaultMarkdownParserOverridden.parse(inputContent)!.content
        );
        htmlConvertedContent = new XMLSerializer().serializeToString(
            htmlFragment
        );
        this.editor?.commands.setContent(htmlConvertedContent.toString());

        // Editor focus
        this.isFocus = true;
        this.editor?.commands.focus('end');
        this.toggleTipTapButtonState();
    }

    // Logs the editor content in markdown format in console
    private markdownOutput() {
        this.markdownContent = defaultMarkdownSerializerOverridden.serialize(
            this.editor!.view.state.doc
        );

        console.log(this.markdownContent);
        console.log(JSON.stringify(this.markdownContent));
    }

    // public async imageUploaded(event: any) {
    //     if (
    //         this.editor!.view.state.selection.$from.parent.inlineContent &&
    //         event.target.files
    //     ) {
    //         const imageData = await this.toBase64(event.target.files[0]);

    //         imageData;

    //         const imageNode = this.editor!.view.state.schema.nodes[
    //             'image'
    //         ].create({
    //             src: imageData,
    //             alt: 'An image',
    //         });

    //         this.editor!.view.dispatch(
    //             this.editor!.view.state.tr.replaceSelectionWith(imageNode)
    //         );
    //         this.editor!.view.focus();
    //     }
    // }

    public toggleTipTapButtonState(): void {
        this.isBold = !!this.editor?.isActive('bold');
        this.isItalic = !!this.editor?.isActive('italic');
        this.isLink = !!this.editor?.isActive('link');
        this.isBulletList = !!this.editor?.isActive('bulletList');
        this.isNumberedList = !!this.editor?.isActive('orderedList');
        this.isStrikeOut = !!this.editor?.isActive('strike');
        this.isUnderline = !!this.editor?.isActive('underline');
    }

    private toBase64 = (file: Blob) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            file && reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

    // Adding a comment to the div
    private addComment(markdownInput: string) {
        // Creating a child div with the styles
        const childCommentDiv = document.createElement('div');
        childCommentDiv.className = 'viewer';
        childCommentDiv.style.minHeight = '100px';
        childCommentDiv.style.height = 'fit-content';
        childCommentDiv.style.border = 'solid #444 0.5px';
        childCommentDiv.style.margin = '10px';
        childCommentDiv.style.padding = '5px';

        // Converting the markdown content from the editor to HTML and inserting the child comment div
        if (markdownInput) {
            // @<1234>
            const serializer = DOMSerializer.fromSchema(modifiedSchema);
            // const htmlFragment = serializer.serializeFragment(
            //     defaultMarkdownParserOverridden.parse(markdownInput)!.content
            // );
            // let htmlString = new XMLSerializer().serializeToString(
            //     htmlFragment
            // );
            // childCommentDiv.innerHTML = htmlString;

            // Prepending the child comment divs in the parent comment div
            this.parentCommentDiv!.prepend(childCommentDiv);
        }
    }
}
const editor = RichTextEditor.compose({
    baseClass: RichTextEditor,
    template,
    styles,
    baseName: 'rich-text-editor'
});

DesignSystem.getOrCreate().withPrefix('nimble').register(editor());
export const richTextEditorTag = DesignSystem.tagFor(RichTextEditor); // used in storybook implementation

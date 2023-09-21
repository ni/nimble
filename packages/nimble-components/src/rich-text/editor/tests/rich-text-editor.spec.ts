import { html } from '@microsoft/fast-element';
import { richTextEditorTag, RichTextEditor } from '..';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';
import type { Button } from '../../../button';
import type { ToggleButton } from '../../../toggle-button';
import { ToolbarButton } from '../testing/types';
import { createEventListener } from '../../../utilities/tests/component';

async function setup(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        // prettier-ignore
        html`<nimble-rich-text-editor>
    <nimble-button slot="footer-actions" id="cancel">Cancel</nimble-button>
    <nimble-button slot="footer-actions" id="ok">OK</nimble-button>
</nimble-rich-text-editor>`
    );
}

describe('RichTextEditor', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-editor')
        ).toBeInstanceOf(RichTextEditor);
    });

    it('should export its tag', () => {
        expect(richTextEditorTag).toBe('nimble-rich-text-editor');
    });

    it('should initialize Tiptap editor', () => {
        expect(pageObject.editorSectionHasChildNodes()).toBeTrue();
        expect(pageObject.getEditorSectionFirstElementChildClassName()).toBe(
            'tiptap ProseMirror'
        );
    });

    it('should set aria role as "textbox"', () => {
        const editor = element.shadowRoot?.querySelector('.editor');

        expect(editor!.getAttribute('role')).toBe('textbox');
    });

    it('should set aria-multiline to true', () => {
        const editor = element.shadowRoot?.querySelector('.editor');

        expect(editor!.getAttribute('aria-multiline')).toBe('true');
    });

    it('should initialize "aria-label" with undefined when there is no "aria-label" set in the element', () => {
        const editor = element.shadowRoot?.querySelector('.editor');

        expect(editor!.hasAttribute('aria-label')).toBeFalse();
    });

    it('should forwards value of aria-label to internal control', () => {
        const editor = element.shadowRoot?.querySelector('.editor');
        element.ariaLabel = 'Rich Text Editor';

        expect(editor!.getAttribute('aria-label')).toBe('Rich Text Editor');
    });

    it('should support setting blank "aria-label" value when setting empty string', () => {
        const editor = element.shadowRoot?.querySelector('.editor');
        element.ariaLabel = '';

        expect(editor!.getAttribute('aria-label')).toBe('');
    });

    it('should remove value of aria-label from internal control when cleared from host', () => {
        const editor = element.shadowRoot?.querySelector('.editor');
        element.ariaLabel = 'not empty';
        element.ariaLabel = null;

        expect(editor!.getAttribute('aria-label')).toBeNull();
    });

    it('should have either one of the list buttons checked at the same time on click', async () => {
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.bulletList)
        ).toBeFalse();
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.numberedList)
        ).toBeFalse();

        await pageObject.clickFooterButton(ToolbarButton.bulletList);
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.bulletList)
        ).toBeTrue();
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.numberedList)
        ).toBeFalse();

        await pageObject.clickFooterButton(ToolbarButton.numberedList);
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.bulletList)
        ).toBeFalse();
        expect(
            pageObject.getButtonCheckedState(ToolbarButton.numberedList)
        ).toBeTrue();
    });

    it('clicking buttons in the slot element should call the click event once', () => {
        const cancelButton: Button = element.querySelector('#cancel')!;
        const okButton: Button = element.querySelector('#ok')!;
        const cancelButtonSpy = jasmine.createSpy();
        const okButtonSpy = jasmine.createSpy();
        cancelButton?.addEventListener('click', cancelButtonSpy);
        okButton?.addEventListener('click', okButtonSpy);

        cancelButton.click();
        okButton.click();

        expect(cancelButtonSpy).toHaveBeenCalledTimes(1);
        expect(okButtonSpy).toHaveBeenCalledTimes(1);
    });

    it('Should return editor as active element after clicking formatting button', async () => {
        await pageObject.setEditorTextContent('Sample Text');
        await pageObject.clickFooterButton(ToolbarButton.bulletList);
        expect(pageObject.isRichTextEditorActiveElement()).toBeTrue();
    });

    const formattingButtons: {
        name: string,
        toolbarButtonIndex: ToolbarButton,
        iconName: string,
        shortcutKey: string,
        shiftKey: boolean
    }[] = [
        {
            name: 'bold',
            toolbarButtonIndex: ToolbarButton.bold,
            iconName: 'NIMBLE-ICON-BOLD-B',
            shortcutKey: 'b',
            shiftKey: false
        },
        {
            name: 'italics',
            toolbarButtonIndex: ToolbarButton.italics,
            iconName: 'NIMBLE-ICON-ITALIC-I',
            shortcutKey: 'i',
            shiftKey: false
        },
        {
            name: 'bullet-list',
            toolbarButtonIndex: ToolbarButton.bulletList,
            iconName: 'NIMBLE-ICON-LIST',
            shortcutKey: '8',
            shiftKey: true
        },
        {
            name: 'numbered-list',
            toolbarButtonIndex: ToolbarButton.numberedList,
            iconName: 'NIMBLE-ICON-NUMBER-LIST',
            shortcutKey: '7',
            shiftKey: true
        }
    ];

    describe('clicking buttons should update the checked state of the toggle button with focus', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `"${value.name}" button click check`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeFalse();

                    await pageObject.clickFooterButton(
                        value.toolbarButtonIndex
                    );

                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeTrue();
                    expect(
                        pageObject.getButtonTabIndex(value.toolbarButtonIndex)
                    ).toBe(0);
                }
            );
        }
    });

    describe('space key press should update the checked state of the buttons', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `"${value.name}" button key press check`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeFalse();

                    pageObject.spaceKeyActivatesButton(
                        value.toolbarButtonIndex
                    );

                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeTrue();
                }
            );
        }
    });

    describe('enter key press should update the checked state of the buttons', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `"${value.name}" button key press check`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeFalse();

                    pageObject.enterKeyActivatesButton(
                        value.toolbarButtonIndex
                    );

                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeTrue();
                }
            );
        }
    });

    describe('keyboard shortcuts should update the checked state of the buttons', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `"${value.name}" button keyboard shortcut check`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeFalse();

                    await pageObject.clickEditorShortcutKeys(
                        value.shortcutKey,
                        value.shiftKey
                    );

                    expect(
                        pageObject.getButtonCheckedState(
                            value.toolbarButtonIndex
                        )
                    ).toBeTrue();
                }
            );
        }
    });

    describe('should not leak change event through shadow DOM for buttons', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `"${value.name}" button not propagate change event to parent element`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                () => {
                    const buttons: NodeListOf<ToggleButton> = element.shadowRoot!.querySelectorAll(
                        'nimble-toggle-button'
                    );
                    const button = buttons[value.toolbarButtonIndex];
                    const buttonParent = button!.parentElement;
                    const spy = jasmine.createSpy();
                    const event = new Event('change', { bubbles: true });

                    buttonParent?.addEventListener('change', spy);
                    button!.dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(0);
                }
            );
        }
    });

    describe('rich text formatting options to its respective HTML elements', () => {
        it('should have "br" tag name when clicking shift + enter', async () => {
            await pageObject.setEditorTextContent('Plain text 1');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Plain text 2');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Plain text 3');
            expect(pageObject.getEditorTagNames()).toEqual(['P', 'BR', 'BR']);
        });

        it('should have "strong" tag name for bold button click', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('bold');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['bold']);
        });

        it('should have br tag name when pressing shift + Enter with bold content', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('bold1');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('bold after hard break');

            expect(pageObject.getEditorTagNames()).toEqual([
                'P',
                'STRONG',
                'BR',
                'STRONG'
            ]);
        });

        it('should have "em" tag name for italics button click', async () => {
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('italics');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['italics']);
        });

        it('should have br tag name when pressing shift + Enter with Italics content', async () => {
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('italics1');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('italics after hard break');

            expect(pageObject.getEditorTagNames()).toEqual([
                'P',
                'EM',
                'BR',
                'EM'
            ]);
        });

        it('should have "ol" tag name for numbered list button click', async () => {
            await pageObject.setEditorTextContent('numbered list');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'numbered list'
            ]);
        });

        it('should have br tag name when pressing shift + Enter with numbered list content', async () => {
            await pageObject.setEditorTextContent('numbered list1');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent(
                'Hard break in first level of numbered list'
            );

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'BR'
            ]);
        });

        it('should have multiple "ol" tag names for numbered list button click', async () => {
            await pageObject.setEditorTextContent('numbered list 1');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('numbered list 2');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'numbered list 1',
                'numbered list 2'
            ]);
        });

        it('should have "ol" tag names for nested numbered lists when clicking "tab"', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.setEditorTextContent('Nested List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'OL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'List',
                'Nested List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.numberedList)
            ).toBeTrue();
        });

        it('should have br tag name when pressing shift + Enter with nested numbered lists content', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Hard break in Nested list');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'OL',
                'LI',
                'P',
                'BR'
            ]);
        });

        it('should have "ol" tag names for numbered lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.setEditorTextContent('Nested List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'OL',
                'LI',
                'P'
            ]);

            await pageObject.pressShiftTabKeysInEditor();

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'List',
                'Nested List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.numberedList)
            ).toBeTrue();
        });

        it('should have "ol" tag name for numbered list and "ul" tag name for nested bullet list', async () => {
            await pageObject.setEditorTextContent('Numbered List');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.setEditorTextContent('Nested Bullet List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Numbered List',
                'Nested Bullet List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.numberedList)
            ).toBeFalse();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bulletList)
            ).toBeTrue();
        });

        it('should have "ul" tag name for bullet list button click', async () => {
            await pageObject.setEditorTextContent('Bullet List');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Bullet List']);
        });

        it('should have br tag name when pressing shift + Enter with bulleted list content', async () => {
            await pageObject.setEditorTextContent('Bulleted List 1');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent(
                'Hard break in first level of bulleted List'
            );

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'BR'
            ]);
        });

        it('should have multiple "ul" tag names for bullet list button click', async () => {
            await pageObject.setEditorTextContent('Bullet List 1');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('Bullet List 2');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bullet List 1',
                'Bullet List 2'
            ]);
        });

        it('should have "ul" tag names for nested bullet lists when clicking "tab"', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.setEditorTextContent('Nested List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'List',
                'Nested List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bulletList)
            ).toBeTrue();
        });

        it('should have br tag name when pressing shift + Enter with nested bulleted lists content', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Nested List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'UL',
                'LI',
                'P',
                'BR'
            ]);
        });

        it('should have "ul" tag name for bullet list and "ol" tag name for nested numbered list', async () => {
            await pageObject.setEditorTextContent('Bullet List');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.clickFooterButton(ToolbarButton.numberedList);
            await pageObject.setEditorTextContent('Nested Numbered List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'OL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bullet List',
                'Nested Numbered List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.numberedList)
            ).toBeTrue();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bulletList)
            ).toBeFalse();
        });

        it('should have "ul" tag names for bullet lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await pageObject.setEditorTextContent('List');
            await pageObject.clickFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.setEditorTextContent('Nested List');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'UL',
                'LI',
                'P'
            ]);

            await pageObject.pressShiftTabKeysInEditor();

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'List',
                'Nested List'
            ]);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bulletList)
            ).toBeTrue();
        });

        it('should have "strong" and "em" tag name for both bold and italics button clicks', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('bold and italics');

            expect(pageObject.getEditorTagNames()).toEqual([
                'P',
                'STRONG',
                'EM'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'bold and italics'
            ]);
        });

        it('should have "strong", "em" and "ol" tag name for all bold, italics and numbered list button clicks', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent(
                'bold, italics and numbered list'
            );
            await pageObject.clickFooterButton(ToolbarButton.numberedList);

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'STRONG',
                'EM'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'bold, italics and numbered list'
            ]);
        });

        it('should have "strong", "em" and "ul" tag name for all bold, italics and bullet list button clicks', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent(
                'bold, italics and bullet list'
            );
            await pageObject.clickFooterButton(ToolbarButton.bulletList);

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'STRONG',
                'EM'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'bold, italics and bullet list'
            ]);
        });

        it('should have different type of list at same level possible', () => {
            element.setMarkdown(`- Bulleted List 
            \n  1. Numbered List 
            \n  - Bulleted List`);
            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'OL',
                'LI',
                'P',
                'UL',
                'LI',
                'P'
            ]);
        });

        describe('Absolute link interactions in the editor', () => {
            describe('various absolute links without other nodes and marks', () => {
                const supportedAbsoluteLink: { name: string }[] = [
                    { name: 'https://nimble.ni.dev/ ' },
                    { name: 'HTTPS://NIMBLE.NI.DEV ' },
                    { name: 'HttPS://NIMBLE.ni.DEV ' },
                    { name: 'http://nimble.ni.dev/ ' },
                    { name: 'HTTP://NIMBLE.NI.DEV ' },
                    { name: 'HttP://nimble.NI.dev ' },
                    {
                        name: 'https://www.example.com/path/=equals&ampersand?question$dollar+plus,comma;semicolon@At '
                    },
                    { name: 'https://example.com/my%20page.html ' },
                    { name: 'https://example.com/smiley😀.html ' },
                    { name: 'https://www.😀.com ' },
                    { name: 'https://example.com/пример.html ' }
                ];

                const focused: string[] = [];
                const disabled: string[] = [];
                for (const value of supportedAbsoluteLink) {
                    const specType = getSpecTypeByNamedList(
                        value,
                        focused,
                        disabled
                    );
                    specType(
                        `should change the ${value.name} to "a" tag when it is a valid absolute link`,
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        async () => {
                            await pageObject.setEditorTextContent(value.name);

                            expect(pageObject.getEditorTagNames()).toEqual([
                                'P',
                                'A'
                            ]);
                            expect(pageObject.getEditorLeafContents()).toEqual([
                                // Name without the trailing space used by the editor to trigger conversion to a link
                                value.name.slice(0, -1)
                            ]);
                        }
                    );
                }
            });

            it('the "a" tag should have href and rel attributes', async () => {
                await pageObject.setEditorTextContent(
                    'https://nimble.ni.dev/ '
                );

                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
                expect(pageObject.getEditorLastChildAttribute('rel')).toBe(
                    'noopener noreferrer'
                );
            });

            it('should not affect bold formatting on the link in editor', async () => {
                await pageObject.clickFooterButton(ToolbarButton.bold);
                await pageObject.setEditorTextContent(
                    'https://nimble.ni.dev/ '
                );

                expect(pageObject.getEditorTagNamesWithClosingTags()).toEqual([
                    'P',
                    'A',
                    '/A',
                    'STRONG',
                    '/STRONG',
                    '/P'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/',
                    ' '
                ]);
            });

            it('should not affect italics formatting on the link in editor', async () => {
                await pageObject.clickFooterButton(ToolbarButton.italics);
                await pageObject.setEditorTextContent(
                    'https://nimble.ni.dev/ '
                );

                expect(pageObject.getEditorTagNamesWithClosingTags()).toEqual([
                    'P',
                    'A',
                    '/A',
                    'EM',
                    '/EM',
                    '/P'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/',
                    ' '
                ]);
            });

            it('should able to add links to the bullet list', async () => {
                await pageObject.setEditorTextContent(
                    'https://nimble.ni.dev/ '
                );
                await pageObject.clickFooterButton(ToolbarButton.bulletList);

                expect(pageObject.getEditorTagNames()).toEqual([
                    'UL',
                    'LI',
                    'P',
                    'A'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
            });

            it('should able to add links to the numbered list', async () => {
                await pageObject.setEditorTextContent(
                    'https://nimble.ni.dev/ '
                );
                await pageObject.clickFooterButton(ToolbarButton.numberedList);

                expect(pageObject.getEditorTagNames()).toEqual([
                    'OL',
                    'LI',
                    'P',
                    'A'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
            });

            describe('various absolute links with different protocols other than https/http should be render as unchanged strings', () => {
                const differentProtocolLinks: { name: string }[] = [
                    { name: 'ftp://example.com/files/document.pdf ' },
                    { name: 'mailto:info@example.com ' },
                    { name: 'info@example.com ' },
                    { name: 'file:///path/to/local/file.txt ' },
                    { name: 'tel:+1234567890 ' },
                    // eslint-disable-next-line no-script-url
                    { name: 'javascript:void(0) ' },
                    { name: 'data:image/png;base64,iVBORw0KG... ' },
                    { name: 'ftps://example.com/files/document.pdf ' },
                    { name: 'ssh://username@example.com ' },
                    { name: 'urn:isbn:0451450523 ' },
                    {
                        name: 'magnet:?xt=urn:btih:8c6dcd8d4f9151cb5cc01c68225b92db417c411f&dn=ExampleFile.iso '
                    },
                    {
                        name: 'bitcoin:1Hf1KqNPZzkFJ5Wv8VPop9uaF5RjKN3N9s?amount=0.001 '
                    },
                    // eslint-disable-next-line no-script-url
                    { name: 'javascript:vbscript:alert("not alert") ' },
                    { name: 'test://test.com ' }
                ];

                const focused: string[] = [];
                const disabled: string[] = [];
                for (const value of differentProtocolLinks) {
                    const specType = getSpecTypeByNamedList(
                        value,
                        focused,
                        disabled
                    );
                    specType(
                        `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        async () => {
                            await pageObject.setEditorTextContent(value.name);

                            expect(pageObject.getEditorTagNames()).toEqual([
                                'P'
                            ]);
                            expect(pageObject.getEditorLeafContents()).toEqual([
                                value.name
                            ]);
                        }
                    );
                }
            });
        });
    });

    describe('various wacky string values input into the editor', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        wackyStrings.forEach(value => {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `wacky string "${value.name}" that are unmodified when rendered the same value within paragraph tag`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await pageObject.setEditorTextContent(value.name);

                    await connect();

                    expect(pageObject.getEditorFirstChildTagName()).toEqual(
                        'P'
                    );
                    expect(pageObject.getEditorFirstChildTextContent()).toBe(
                        value.name
                    );

                    await disconnect();
                }
            );
        });
    });

    it('setting an empty string should clear a value in the editor', () => {
        element.setMarkdown('markdown string');
        expect(pageObject.getEditorTagNames()).toEqual(['P']);
        expect(pageObject.getEditorLeafContents()).toEqual(['markdown string']);

        element.setMarkdown('');
        expect(pageObject.getEditorTagNames()).toEqual(['P', 'BR']);
        expect(pageObject.getEditorLeafContents()).toEqual(['']);

        element.setMarkdown('new markdown string');
        expect(pageObject.getEditorTagNames()).toEqual(['P']);
        expect(pageObject.getEditorLeafContents()).toEqual([
            'new markdown string'
        ]);
    });

    describe('Absolute link markdown tests', () => {
        describe('asserting rendered links in the editor', () => {
            it('absolute link markdown string to "a" tags with the link as the text content', () => {
                element.setMarkdown('<https://nimble.ni.dev/>');

                expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('bulleted list with absolute links markdown string to "ul", "li" and "a" tags', () => {
                element.setMarkdown('* <https://nimble.ni.dev/>');

                expect(pageObject.getEditorTagNames()).toEqual([
                    'UL',
                    'LI',
                    'P',
                    'A'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('numbered list with absolute links markdown string to "ol", "li" and "a" tags', () => {
                element.setMarkdown('1. <https://nimble.ni.dev/>');

                expect(pageObject.getEditorTagNames()).toEqual([
                    'OL',
                    'LI',
                    'P',
                    'A'
                ]);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in bold markdown string should not be parsed to "strong" tag', () => {
                element.setMarkdown('**<https://nimble.ni.dev/>**');

                expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in italics markdown string should not be parsed to "em" tag', () => {
                element.setMarkdown('*<https://nimble.ni.dev/>*');

                expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('absolute links in both bold and italics markdown string should not be parsed to "strong" and "em" tag', () => {
                element.setMarkdown('___<https://nimble.ni.dev/>___');

                expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://nimble.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://nimble.ni.dev/'
                );
            });

            it('adding marks like bold inside absolute links should not be parsed to "strong" tag', () => {
                element.setMarkdown('<https://**nimble**.ni.dev/>');

                expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
                expect(pageObject.getEditorLeafContents()).toEqual([
                    'https://**nimble**.ni.dev/'
                ]);
                expect(pageObject.getEditorLastChildAttribute('href')).toBe(
                    'https://**nimble**.ni.dev/'
                );
            });
        });

        describe('asserting getMarkdown for rendered links', () => {
            it('absolute link markdown string', () => {
                element.setMarkdown('<https://nimble.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '<https://nimble.ni.dev/>'
                );
            });

            it('bulleted list with absolute links markdown string', () => {
                element.setMarkdown('* <https://nimble.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '* <https://nimble.ni.dev/>'
                );
            });

            it('numbered list with absolute links markdown string', () => {
                element.setMarkdown('1. <https://nimble.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '1. <https://nimble.ni.dev/>'
                );
            });

            it('absolute links in bold markdown string should not be serialized to link in bold markdown', () => {
                element.setMarkdown('**<https://nimble.ni.dev/>**');

                expect(element.getMarkdown()).toEqual(
                    '<https://nimble.ni.dev/>'
                );
            });

            it('absolute links in italics markdown string should not be serialized to link in italics markdown', () => {
                element.setMarkdown('*<https://nimble.ni.dev/>*');

                expect(element.getMarkdown()).toEqual(
                    '<https://nimble.ni.dev/>'
                );
            });

            it('absolute links in both bold and italics markdown string should not be serialized to link in bold and italics markdown', () => {
                element.setMarkdown('___<https://nimble.ni.dev/>___');

                expect(element.getMarkdown()).toEqual(
                    '<https://nimble.ni.dev/>'
                );
            });

            it('adding marks like bold inside absolute links should not be serialized to bold markdown', () => {
                element.setMarkdown('<https://**nimble**.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '<https://**nimble**.ni.dev/>'
                );
            });

            it('adding marks like italics inside absolute links should not be serialized to italics markdown', () => {
                element.setMarkdown('<https://*nimble*.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '<https://*nimble*.ni.dev/>'
                );
            });

            it('adding both the italics and bold inside absolute links should not be serialized to bold and italics markdown', () => {
                element.setMarkdown('<https://__nimble__.ni.dev/>');

                expect(element.getMarkdown()).toEqual(
                    '<https://__nimble__.ni.dev/>'
                );
            });
        });
    });

    it('Should return a empty string when empty string is assigned', () => {
        element.setMarkdown('markdown string');
        expect(element.getMarkdown()).toBe('markdown string');

        element.setMarkdown('');
        expect(element.getMarkdown()).toBe('');

        element.setMarkdown('new markdown string');
        expect(element.getMarkdown()).toBe('new markdown string');
    });

    it('setting an markdown with hard break syntax should have respective br tag', () => {
        element.setMarkdown('markdown\\\nstring');
        expect(pageObject.getEditorTagNames()).toEqual(['P', 'BR']);
    });

    describe('Should return respective markdown when supported rich text formatting options from markdown string is assigned', () => {
        beforeEach(async () => {
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('Should return bold markdown ("**") when bold markdown string("**") is assigned ', () => {
            element.setMarkdown('**Bold**');
            expect(element.getMarkdown()).toBe('**Bold**');
        });

        it('Should return bold markdown ("**") when bold markdown string("__") is assigned', () => {
            element.setMarkdown('__Bold__');
            expect(element.getMarkdown()).toBe('**Bold**');
        });

        it('Should return italics markdown ("*") when italics markdown string("*") is assigned', () => {
            element.setMarkdown('*Italics*');
            expect(element.getMarkdown()).toBe('*Italics*');
        });

        it('Should return italics markdown ("*") when italics markdown string("_") is assigned', () => {
            element.setMarkdown('_Italics_');
            expect(element.getMarkdown()).toBe('*Italics*');
        });

        it('Should return respective markdown when numbered list markdown ("1.") is assigned', () => {
            element.setMarkdown('1. Numbered list');
            expect(element.getMarkdown()).toBe('1. Numbered list');
        });

        it('Should return respective markdown when numbered list markdown ("1)") is assigned', () => {
            element.setMarkdown('1) Numbered list');
            expect(element.getMarkdown()).toBe('1. Numbered list');
        });

        it('Should return respective markdown when multiple numbered lists markdown string("1.\n2.") is assigned', () => {
            element.setMarkdown('1. Option 1\n\n2. Option 2');
            expect(element.getMarkdown()).toBe('1. Option 1\n\n2. Option 2');
        });

        it('Should return respective markdown when multiple empty numbered lists markdown string("1.\n2.") is assigned', () => {
            element.setMarkdown('1. \n\n2. ');
            expect(element.getMarkdown()).toBe('1. \n\n2. ');
        });

        it('Should return respective markdown whennumbered lists that start with numbers and are not sequential is assigned', () => {
            element.setMarkdown('1. Option 1\n 1. Option 2');
            expect(element.getMarkdown()).toBe('1. Option 1\n\n2. Option 2');
        });

        it('Should return respective markdown when numbered lists if there is some content between lists is assigned', () => {
            element.setMarkdown(
                '1. Option 1\n\nSome content in between lists\n\n2. Option 2'
            );
            expect(element.getMarkdown()).toBe(
                '1. Option 1\n\nSome content in between lists\n\n2. Option 2'
            );
        });

        it('Should return respective markdown when bulleted list markdown string("*") is assigned', () => {
            element.setMarkdown('* Bulleted list');
            expect(element.getMarkdown()).toBe('* Bulleted list');
        });

        it('Should return respective markdown when bulleted list markdown string("-") is assigned', () => {
            element.setMarkdown('- Bulleted list');
            expect(element.getMarkdown()).toBe('* Bulleted list');
        });

        it('Should return respective markdown when bulleted list markdown string("+") is assigned', () => {
            element.setMarkdown('+ Bulleted list');
            expect(element.getMarkdown()).toBe('* Bulleted list');
        });

        it('Should return respective markdown when multiple bulleted lists markdown string("* \n* \n*") is assigned', () => {
            element.setMarkdown('* Option 1\n\n* Option 2\n\n* Option 3');
            expect(element.getMarkdown()).toBe(
                '* Option 1\n\n* Option 2\n\n* Option 3'
            );
        });

        it('Should return respective markdown when bulleted lists with some content between lists is assigned', () => {
            element.setMarkdown(
                '* Option 1\n\nSome content in between lists\n\n* Option 2'
            );
            expect(element.getMarkdown()).toBe(
                '* Option 1\n\nSome content in between lists\n\n* Option 2'
            );
        });

        it('Should return respective markdown when numbered list with bold markdown string is assigned', () => {
            element.setMarkdown('1. **Numbered list in bold**');
            expect(element.getMarkdown()).toBe('1. **Numbered list in bold**');
        });

        it('Should return respective markdown when bulleted list with italics markdown string is assigned', () => {
            element.setMarkdown('* *Bulleted list in italics*');
            expect(element.getMarkdown()).toBe('* *Bulleted list in italics*');
        });

        it('Should return respective markdown when combination of all supported markdown string is assigned', () => {
            element.setMarkdown(
                '1. ***Numbered list with bold and italics***\n\n* ___Bulleted list with bold and italics___'
            );
            expect(element.getMarkdown()).toBe(
                '1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***'
            );
        });
    });

    describe('Should return markdown without any changes when various not supported markdown string values are assigned', () => {
        const notSupportedMarkdownStrings: { name: string }[] = [
            { name: '&nbsp;' },
            { name: '(c) (C) (r) (R) (tm) (TM) (p) (P) +-' },
            { name: '<div><p>text</p></div>' },
            { name: '<b>not bold</b>' },
            { name: '<em>not italic</em>' },
            { name: '<ol><li>not list</li><li>not list</li></ol>' },
            { name: '<ul><li>not list</li><li>not list</li></ul>' },
            {
                name: '<a href="https://nimble.ni.dev/">https://nimble.ni.dev/</a>'
            },
            { name: '<script>alert("not alert")</script>' }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of notSupportedMarkdownStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `markdown string "${value.name}" returns as plain text "${value.name}" without any change`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(element.getMarkdown()).toBe(value.name);

                    await disconnect();
                }
            );
        }
    });

    describe('Should return markdown with escape character (back slash) when various special markdown syntax are assigned', () => {
        const r = String.raw;
        const specialMarkdownStrings: { name: string, value: string }[] = [
            { name: '> blockquote', value: r`\> blockquote` },
            { name: '`code`', value: '\\`code\\`' },
            { name: '```fence```', value: '\\`\\`\\`fence\\`\\`\\`' },
            { name: '~~Strikethrough~~', value: r`\~\~Strikethrough\~\~` },
            { name: '# Heading 1', value: r`\# Heading 1` },
            { name: '## Heading 2', value: r`\## Heading 2` },
            { name: '### Heading 3', value: r`\### Heading 3` },
            { name: '[link](url)', value: r`\[link\](url)` },
            {
                name: '[ref][link] [link]:url',
                value: r`\[ref\]\[link\] \[link\]:url`
            },
            { name: '![Text](Image)', value: r`!\[Text\](Image)` },
            { name: '---', value: r`\---` },
            { name: '***', value: r`\*\*\*` },
            { name: '___', value: r`\__\_` },
            { name: '-Infinity', value: r`\-Infinity` },
            { name: '-2147483648/-1', value: r`\-2147483648/-1` }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of specialMarkdownStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `special markdown string "${value.name}" returns as plain text "${value.value}" with added esacpe character`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(element.getMarkdown()).toBe(value.value);

                    await disconnect();
                }
            );
        }
    });

    describe('`getMarkdown` with hard break backslashes should be same immediately after `setMarkdown`', () => {
        const r = String.raw;
        const hardBreakMarkdownStrings: { name: string, value: string }[] = [
            {
                name: 'bold and italics',
                value: r`**bold**\
*Italics*`
            },
            {
                name: 'two first level bulleted list items',
                value: r`* list\
  hard break content

* list`
            },
            {
                name: 'two first level bulleted list items and with nested list',
                value: r`* list\
  hard break content

* list

  * nested list\
    nested hard break content`
            },
            {
                name: 'two first level numbered list items',
                value: r`1. list\
   hard break content

2. list`
            },
            {
                name: 'two first level numbered list items and with nested list',
                value: r`1. list\
   hard break content

2. list

   1. nested list\
      nested hard break content`
            }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of hardBreakMarkdownStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `markdown string with hard break in "${value.name}" returns as same without any change`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.value);

                    await connect();

                    expect(element.getMarkdown()).toBe(value.value);

                    await disconnect();
                }
            );
        }
    });

    describe('Should return markdown without any changes when various wacky string values are assigned', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        wackyStrings
            .filter(
                value => value.name !== '\x00'
                    && value.name !== '-Infinity'
                    && value.name !== '-2147483648/-1'
            )
            .forEach(value => {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                specType(
                    `wacky string "${value.name}" returns unmodified when set the same markdown string"${value.name}"`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        element.setMarkdown(value.name);

                        await connect();

                        expect(element.getMarkdown()).toBe(value.name);

                        await disconnect();
                    }
                );
            });
    });

    describe('Should return markdown with escape character (back slash) when wacky string with special markdown syntax are assigned', () => {
        const r = String.raw;
        const wackyStringWithSpecialMarkdownCharacter: {
            name: string,
            value: string
        }[] = [
            { name: '-Infinity', value: r`\-Infinity` },
            { name: '-2147483648/-1', value: r`\-2147483648/-1` }
        ];

        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of wackyStringWithSpecialMarkdownCharacter) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                ` wacky string contains special markdown syntax "${value.name}" returns as plain text "${value.value}" with added escape character`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(element.getMarkdown()).toBe(value.value);

                    await disconnect();
                }
            );
        }
    });

    describe('Should return modified markdown when various wacky string values are assigned', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        const modifiedWackyStrings: {
            name: string,
            content: string
        }[] = [
            { name: '\0', content: '�' },
            { name: '\uFFFD', content: '�' },
            { name: '\x00', content: '�' },
            { name: '\r\r', content: '' }
        ];

        for (const value of modifiedWackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            specType(
                `wacky string "${value.name}" returns modified when assigned`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(element.getMarkdown()).toBe(value.content);

                    await disconnect();
                }
            );
        }
    });

    describe('disabled state', () => {
        it('should reflect disabled value to the aria-disabled of editor-section', async () => {
            const editor = element.shadowRoot?.querySelector('.editor');
            expect(editor!.getAttribute('aria-disabled')).toBe('false');

            await pageObject.setDisabled(true);

            expect(editor!.getAttribute('aria-disabled')).toBe('true');
        });

        it('should reflect disabled value to the "contenteditable" attribute of tiptap editor', async () => {
            const editor = element.shadowRoot?.querySelector('.ProseMirror');
            expect(editor!.getAttribute('contenteditable')).toBe('true');

            await pageObject.setDisabled(true);

            expect(editor!.getAttribute('contenteditable')).toBe('false');
        });

        it('should enable the editor when "disabled" attribute is set and removed', async () => {
            const editor = element.shadowRoot?.querySelector('.ProseMirror');
            expect(pageObject.getEditorTabIndex()).toBe('0');

            await pageObject.setDisabled(true);
            await pageObject.setDisabled(false);

            expect(editor!.getAttribute('contenteditable')).toBe('true');
        });

        it('should change the tabindex value of the editor when disabled value changes', async () => {
            expect(pageObject.getEditorTabIndex()).toBe('0');

            await pageObject.setDisabled(true);

            expect(pageObject.getEditorTabIndex()).toBe('-1');
        });

        describe('should reflect disabled value to the disabled and aria-disabled state of toggle buttons', () => {
            const focused: string[] = [];
            const disabled: string[] = [];
            for (const value of formattingButtons) {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                specType(
                    `for "${value.name}" button`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        expect(
                            pageObject.isButtonDisabled(
                                value.toolbarButtonIndex
                            )
                        ).toBeFalse();

                        await pageObject.setDisabled(true);

                        expect(
                            pageObject.isButtonDisabled(
                                value.toolbarButtonIndex
                            )
                        ).toBeTrue();
                    }
                );
            }
        });
    });

    it('should hide the footer when "footer-hidden" attribute is enabled', async () => {
        expect(pageObject.isFooterHidden()).toBeFalse();

        await pageObject.setFooterHidden(true);

        expect(pageObject.isFooterHidden()).toBeTrue();
    });

    it('should show the footer when "footer-hidden" attribute is disabled', async () => {
        expect(pageObject.isFooterHidden()).toBeFalse();

        await pageObject.setFooterHidden(true);
        await pageObject.setFooterHidden(false);

        expect(pageObject.isFooterHidden()).toBeFalse();
    });

    it('should fire "input" event when there is an input to the editor', async () => {
        const inputEventListener = createEventListener(element, 'input');

        await pageObject.setEditorTextContent('input');
        await inputEventListener.promise;

        expect(inputEventListener.spy).toHaveBeenCalledTimes(1);
    });

    it('should not fire "input" event when setting the content through "setMarkdown"', () => {
        const inputEventListener = createEventListener(element, 'input');

        element.setMarkdown('input');

        expect(inputEventListener.spy).not.toHaveBeenCalled();
    });

    it('should fire "input" event when the text is updated/removed from the editor', async () => {
        const inputEventListener = createEventListener(element, 'input');

        await pageObject.setEditorTextContent('update');
        await inputEventListener.promise;

        expect(inputEventListener.spy).toHaveBeenCalledTimes(1);

        await pageObject.setEditorTextContent('');
        await inputEventListener.promise;

        expect(inputEventListener.spy).toHaveBeenCalledTimes(1);
    });

    it('should initialize "empty" to true and set false when there is content', async () => {
        expect(element.empty).toBeTrue();

        await pageObject.replaceEditorContent('not empty');
        expect(element.empty).toBeFalse();

        await pageObject.replaceEditorContent('');
        expect(element.empty).toBeTrue();
    });

    it('should update "empty" when the content is loaded with "setMarkdown"', () => {
        expect(element.empty).toBeTrue();

        element.setMarkdown('not empty');
        expect(element.empty).toBeFalse();

        element.setMarkdown('');
        expect(element.empty).toBeTrue();
    });

    it('should return true for "empty" if there is only whitespace', async () => {
        expect(element.empty).toBeTrue();

        await pageObject.setEditorTextContent('       ');
        expect(element.empty).toBeTrue();

        element.setMarkdown('  ');
        expect(element.empty).toBeTrue();
    });

    it('should return true for "empty" even if the placeholder content is set', () => {
        expect(element.empty).toBeTrue();

        element.placeholder = 'Placeholder text';
        expect(element.empty).toBeTrue();
    });

    it('should initialize the "placeholder" attribute with undefined', () => {
        expect(element.placeholder).toBeUndefined();
    });

    it('should reflect the "placeholder" value to its internal attribute', () => {
        expect(pageObject.getPlaceholderValue()).toBe('');

        element.placeholder = 'Placeholder text';

        expect(pageObject.getPlaceholderValue()).toBe('Placeholder text');
    });

    it('should set "placeholder" value to empty when attribute is cleared with an empty string', () => {
        element.placeholder = 'Placeholder text';

        expect(pageObject.getPlaceholderValue()).toBe('Placeholder text');

        element.placeholder = '';

        expect(pageObject.getPlaceholderValue()).toBe('');
    });
});

describe('RichTextEditor Before DOM Connection', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    it('Should return respective markdown when combination of all supported markdown string is assigned before the dom is connected to element', async () => {
        element.setMarkdown(
            '1. ***Numbered list with bold and italics***\n\n* ___Bulleted list with bold and italics___'
        );
        expect(element.getMarkdown()).toBe(
            '1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***'
        );
        expect(element.isConnected).toBeFalsy();
        await connect();
        expect(element.isConnected).toBeTruthy();
        pageObject = new RichTextEditorPageObject(element);
        expect(pageObject.getEditorTagNames()).toEqual([
            'OL',
            'LI',
            'P',
            'STRONG',
            'EM',
            'UL',
            'LI',
            'P',
            'STRONG',
            'EM'
        ]);
        expect(pageObject.getEditorLeafContents()).toEqual([
            'Numbered list with bold and italics',
            'Bulleted list with bold and italics'
        ]);
        expect(element.getMarkdown()).toBe(
            '1. ***Numbered list with bold and italics***\n\n* ***Bulleted list with bold and italics***'
        );
        await disconnect();
    });
});

import { html } from '@microsoft/fast-element';
import { richTextEditorTag, RichTextEditor } from '..';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { wackyStrings } from '../../utilities/tests/wacky-strings';
import type { Button } from '../../button';
import type { ToggleButton } from '../../toggle-button';
import { ToolbarButton } from '../testing/types';

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
            'ProseMirror'
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
        it('should have "strong" tag name for bold button click', async () => {
            await pageObject.clickFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('bold');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['bold']);
        });

        it('should have "em" tag name for italics button click', async () => {
            await pageObject.clickFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('italics');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['italics']);
        });

        it('should have "ol" tag name for numbered list button click', async () => {
            await pageObject.setEditorTextContent('numbered list');
            await pageObject.clickFooterButton(ToolbarButton.numberedList);

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'numbered list'
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
            ).toBeTrue();
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
            ).toBeTrue();
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
    });

    describe('various wacky string values input into the editor', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        wackyStrings.forEach(value => {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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

    describe('supported rich text formatting options from markdown string to its respective HTML elements', () => {
        beforeEach(async () => {
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('bold markdown string("**") to "strong" HTML tag', () => {
            element.setMarkdown('**Bold**');
            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Bold']);
        });

        it('bold markdown string("__") to "strong" HTML tag', () => {
            element.setMarkdown('__Bold__');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Bold']);
        });

        it('italics markdown string("*") to "em" HTML tag', () => {
            element.setMarkdown('*Italics*');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Italics']);
        });

        it('italics markdown string("_") to "em" HTML tag', () => {
            element.setMarkdown('_Italics_');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Italics']);
        });

        it('numbered list markdown string("1.") to "ol" and "li" HTML tags', () => {
            element.setMarkdown('1. Numbered list');

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Numbered list'
            ]);
        });

        it('numbered list markdown string("1)") to "ol" and "li" HTML tags', () => {
            element.setMarkdown('1) Numbered list');

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Numbered list'
            ]);
        });

        it('multiple numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            element.setMarkdown('1. Option 1\n 2. Option 2');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('multiple empty numbered lists markdown string("1.\n2.") to "ol" and "li" HTML tags', () => {
            element.setMarkdown('1.    \n 2.    ');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'BR',
                'LI',
                'P',
                'BR'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual(['', '']);
        });

        it('numbered lists that start with numbers and are not sequential to "ol" and "li" HTML tags', () => {
            element.setMarkdown('1. Option 1\n 1. Option 2');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Option 1',
                'Option 2'
            ]);
        });

        it('numbered lists if there is some content between lists', () => {
            element.setMarkdown(
                '1. Option 1\n\nSome content in between lists\n\n 2. Option 2'
            );

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'P',
                'OL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('bulleted list markdown string("*") to "ul" and "li" HTML tags', () => {
            element.setMarkdown('* Bulleted list');

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bulleted list'
            ]);
        });

        it('bulleted list markdown string("-") to "ul" and "li" HTML tags', () => {
            element.setMarkdown('- Bulleted list');

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bulleted list'
            ]);
        });

        it('bulleted list markdown string("+") to "ul" and "li" HTML tags', () => {
            element.setMarkdown('+ Bulleted list');

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bulleted list'
            ]);
        });

        it('multiple bulleted lists markdown string("* \n* \n*") to "ul" and "li" HTML tags', () => {
            element.setMarkdown('* Option 1\n * Option 2\n * Option 3');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Option 1',
                'Option 2',
                'Option 3'
            ]);
        });

        it('bulleted lists if there is some content between lists', () => {
            element.setMarkdown(
                '* Option 1\n\nSome content in between lists\n\n * Option 2'
            );

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'P',
                'UL',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Option 1',
                'Some content in between lists',
                'Option 2'
            ]);
        });

        it('numbered list with bold markdown string to "ol", "li" and "strong" HTML tags', () => {
            element.setMarkdown('1. **Numbered list in bold**');

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'STRONG'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Numbered list in bold'
            ]);
        });

        it('bulleted list with italics markdown string to "ul", "li" and "em" HTML tags', () => {
            element.setMarkdown('* *Bulleted list in italics*');

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'EM'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'Bulleted list in italics'
            ]);
        });

        it('combination of all supported markdown string', () => {
            element.setMarkdown(
                '1. ***Numbered list with bold and italics***\n* ___Bulleted list with bold and italics___'
            );

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
        });
    });

    describe('various not supported markdown string values render as unchanged strings', () => {
        const notSupportedMarkdownStrings: { name: string }[] = [
            { name: '> blockquote' },
            { name: '`code`' },
            { name: '```fence```' },
            { name: '~~Strikethrough~~' },
            { name: '# Heading 1' },
            { name: '## Heading 2' },
            { name: '### Heading 3' },
            { name: '[link](url)' },
            { name: '[ref][link] [link]:url' },
            { name: '![Text](Image)' },
            { name: '&nbsp;' },
            { name: '---' },
            { name: '***' },
            { name: '___' },
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `string "${value.name}" renders as plain text "${value.name}" within paragraph tag`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(pageObject.getEditorTagNames()).toEqual(['P']);
                    expect(pageObject.getEditorLeafContents()).toEqual([
                        value.name
                    ]);

                    await disconnect();
                }
            );
        }
    });

    describe('various wacky string values render as unchanged strings', () => {
        const focused: string[] = [];
        const disabled: string[] = [];

        wackyStrings
            .filter(value => value.name !== '\x00')
            .forEach(value => {
                const specType = getSpecTypeByNamedList(
                    value,
                    focused,
                    disabled
                );
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                specType(
                    `wacky string "${value.name}" that are unmodified when set the same "${value.name}" within paragraph tag`,
                    // eslint-disable-next-line @typescript-eslint/no-loop-func
                    async () => {
                        element.setMarkdown(value.name);

                        await connect();

                        expect(pageObject.getEditorTagNames()).toEqual(['P']);
                        expect(pageObject.getEditorLeafContents()).toEqual([
                            value.name
                        ]);

                        await disconnect();
                    }
                );
            });
    });

    describe('various wacky string values modified when rendered', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        const modifiedWackyStrings: {
            name: string,
            tags: string[],
            textContent: string[]
        }[] = [
            { name: '\0', tags: ['P'], textContent: ['�'] },
            { name: '\uFFFD', tags: ['P'], textContent: ['�'] },
            { name: '\x00', tags: ['P'], textContent: ['�'] },
            { name: '\r\r', tags: ['P', 'BR'], textContent: [''] }
        ];

        for (const value of modifiedWackyStrings) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `wacky string "${value.name}" modified when rendered`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    element.setMarkdown(value.name);

                    await connect();

                    expect(pageObject.getEditorTagNames()).toEqual(value.tags);
                    expect(pageObject.getEditorLeafContents()).toEqual(
                        value.textContent
                    );

                    await disconnect();
                }
            );
        }
    });

    it('Should return a empty string when empty string is assigned', () => {
        element.setMarkdown('markdown string');
        expect(element.getMarkdown()).toBe('markdown string');

        element.setMarkdown('');
        expect(element.getMarkdown()).toBe('');

        element.setMarkdown('new markdown string');
        expect(element.getMarkdown()).toBe('new markdown string');
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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
                // eslint-disable-next-line @typescript-eslint/no-loop-func
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                ` wacky string contains special markdown syntax "${value.name}" returns as plain text "${value.value}" with added esacpe character`,
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
            // eslint-disable-next-line @typescript-eslint/no-loop-func
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

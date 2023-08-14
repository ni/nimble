import { html } from '@microsoft/fast-element';
import { keySpace, keyEnter } from '@microsoft/fast-web-utilities';
import { richTextEditorTag, RichTextEditor } from '..';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { wackyStrings } from '../../utilities/tests/wacky-strings';

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
        const editor = pageObject.getEditorSection();

        expect(editor!.hasChildNodes()).toBeTrue();
        expect(editor?.firstElementChild!.className).toBe('ProseMirror');
    });

    it('should set aria role as "textbox"', () => {
        const editor = pageObject.getEditorSection();

        expect(editor!.getAttribute('role')).toBe('textbox');
    });

    it('should set aria-multiline textbox to true', () => {
        const editor = pageObject.getEditorSection();

        expect(editor!.getAttribute('aria-multiline')).toBe('true');
    });

    it('should have a slot and part named "footer-actions"', () => {
        const slot = pageObject.getSlotElement();

        expect(slot?.getAttribute('name')).toBe('footer-actions');
        expect(slot?.parentElement?.getAttribute('part')).toBe(
            'footer-actions'
        );
    });

    it('should have either one of the list buttons checked at the same time on click', async () => {
        await waitForUpdatesAsync();
        const bulletListButton = pageObject.getFormattingButton('bullet-list')!;
        const numberedListButton = pageObject.getFormattingButton('numbered-list')!;
        expect(bulletListButton.checked).toBeFalse();
        expect(numberedListButton.checked).toBeFalse();

        bulletListButton.click();
        expect(bulletListButton.checked).toBeTrue();
        expect(numberedListButton.checked).toBeFalse();

        numberedListButton.click();
        expect(bulletListButton.checked).toBeFalse();
        expect(numberedListButton.checked).toBeTrue();
    });

    const formattingButtons: {
        name: string,
        iconName: string,
        shortcutKey: string,
        shiftKey: boolean
    }[] = [
        {
            name: 'bold',
            iconName: 'NIMBLE-ICON-BOLD-B',
            shortcutKey: 'b',
            shiftKey: false
        },
        {
            name: 'italics',
            iconName: 'NIMBLE-ICON-ITALIC-I',
            shortcutKey: 'i',
            shiftKey: false
        },
        {
            name: 'bullet-list',
            iconName: 'NIMBLE-ICON-LIST',
            shortcutKey: '8',
            shiftKey: true
        },
        {
            name: 'numbered-list',
            iconName: 'NIMBLE-ICON-NUMBER-LIST',
            shortcutKey: '7',
            shiftKey: true
        }
    ];

    describe('should initialize nimble toggle buttons with necessary settings', () => {
        const focused: string[] = [];
        const disabled: string[] = [];
        for (const value of formattingButtons) {
            const specType = getSpecTypeByNamedList(value, focused, disabled);
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            specType(
                `button "${value.name}" with necessary settings`,
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                async () => {
                    await waitForUpdatesAsync();
                    const button = pageObject.getFormattingButton(value.name)!;

                    expect(button.contentHidden).toBeTrue();
                    expect(button.checked).toBeFalse();
                    expect(button.appearance).toBe('ghost');
                    expect(button.slot).toBe('start');
                    expect(button.firstElementChild!.tagName).toBe(
                        value.iconName
                    );
                }
            );
        }
    });

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
                    await waitForUpdatesAsync();
                    const button = pageObject.getFormattingButton(value.name)!;
                    expect(button.checked).toBeFalse();

                    button.click();

                    expect(button.checked).toBeTrue();
                    expect(button.tabIndex).toBe(0);
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
                async () => {
                    await waitForUpdatesAsync();
                    const button = pageObject.getFormattingButton(value.name)!;
                    expect(button.checked).toBeFalse();

                    const event = new KeyboardEvent('keypress', {
                        key: keySpace
                    } as KeyboardEventInit);
                    button.control.dispatchEvent(event);

                    expect(button.checked).toBeTrue();
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
                async () => {
                    await waitForUpdatesAsync();
                    const button = pageObject.getFormattingButton(value.name)!;
                    expect(button.checked).toBeFalse();

                    const event = new KeyboardEvent('keypress', {
                        key: keyEnter
                    } as KeyboardEventInit);
                    button.control.dispatchEvent(event);

                    expect(button.checked).toBeTrue();
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
                    await waitForUpdatesAsync();
                    const button = pageObject.getFormattingButton(value.name)!;
                    const editor = pageObject.getTiptapEditor();
                    expect(button.checked).toBeFalse();

                    const event = new KeyboardEvent('keydown', {
                        key: value.shortcutKey,
                        ctrlKey: true,
                        shiftKey: value.shiftKey,
                        bubbles: true,
                        cancelable: true
                    });
                    editor!.dispatchEvent(event);

                    expect(button.checked).toBeTrue();
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
                    const button = pageObject.getFormattingButton(value.name)!;
                    const buttonParent = button.parentElement;
                    let parentChangeEventFired = false;

                    buttonParent?.addEventListener('change', () => {
                        parentChangeEventFired = true;
                    });

                    const event = new Event('change', { bubbles: true });
                    button.dispatchEvent(event);

                    expect(parentChangeEventFired).toBeFalse();
                }
            );
        }
    });

    describe('rich text formatting options to its respective HTML elements', () => {
        it('should have "strong" tag name for bold button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('bold')!;
            const editor = pageObject.getTiptapEditor()!;

            button.click();
            await waitForUpdatesAsync();
            editor.textContent = 'bold';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['bold']);
        });

        it('should have "em" tag name for italics button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('italics')!;
            const editor = pageObject.getTiptapEditor()!;

            button.click();
            await waitForUpdatesAsync();
            editor.textContent = 'italics';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['italics']);
        });

        it('should have "ol" tag name for numbered list button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('numbered-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'numbered list';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'numbered list'
            ]);
        });

        it('should have "ul" tag name for bullet list button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'bullet list';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual(['bullet list']);
        });

        it('should have "strong" and "em" tag name for both bold and italics button clicks', async () => {
            await waitForUpdatesAsync();
            const boldButton = pageObject.getFormattingButton('bold')!;
            const italicsButton = pageObject.getFormattingButton('italics')!;
            const editor = pageObject.getTiptapEditor()!;

            boldButton.click();
            await waitForUpdatesAsync();
            italicsButton.click();
            await waitForUpdatesAsync();
            editor.textContent = 'bold and italics';
            await waitForUpdatesAsync();

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
            await waitForUpdatesAsync();
            const boldButton = pageObject.getFormattingButton('bold')!;
            const italicsButton = pageObject.getFormattingButton('italics')!;
            const numberedListButton = pageObject.getFormattingButton('numbered-list')!;
            const editor = pageObject.getTiptapEditor()!;

            boldButton.click();
            await waitForUpdatesAsync();
            italicsButton.click();
            await waitForUpdatesAsync();
            editor.textContent = 'bold, italics and numbered list';
            await waitForUpdatesAsync();
            numberedListButton.click();
            await waitForUpdatesAsync();

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
            await waitForUpdatesAsync();
            const boldButton = pageObject.getFormattingButton('bold')!;
            const italicsButton = pageObject.getFormattingButton('italics')!;
            const bulletListButton = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            boldButton.click();
            await waitForUpdatesAsync();
            italicsButton.click();
            await waitForUpdatesAsync();
            editor.textContent = 'bold, italics and bullet list';
            await waitForUpdatesAsync();
            bulletListButton.click();
            await waitForUpdatesAsync();

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
                    await waitForUpdatesAsync();
                    const editor = pageObject.getTiptapEditor()!;
                    editor.textContent = value.name;

                    await connect();

                    expect(
                        pageObject.getEditorFirstChildElement()?.tagName
                    ).toEqual('P');
                    expect(
                        pageObject.getEditorFirstChildElement()?.textContent
                    ).toBe(value.name);

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
        const specialMarkdownStrings: { name: string, value: string }[] = [
            { name: '> blockquote', value: '\\> blockquote' },
            { name: '`code`', value: '\\`code\\`' },
            { name: '```fence```', value: '\\`\\`\\`fence\\`\\`\\`' },
            { name: '~~Strikethrough~~', value: '\\~\\~Strikethrough\\~\\~' },
            { name: '# Heading 1', value: '\\# Heading 1' },
            { name: '## Heading 2', value: '\\## Heading 2' },
            { name: '### Heading 3', value: '\\### Heading 3' },
            { name: '[link](url)', value: '\\[link\\](url)' },
            {
                name: '[ref][link] [link]:url',
                value: '\\[ref\\]\\[link\\] \\[link\\]:url'
            },
            { name: '![Text](Image)', value: '!\\[Text\\](Image)' },
            { name: '---', value: '\\---' },
            { name: '***', value: '\\*\\*\\*' },
            { name: '___', value: '\\__\\_' },
            { name: '-Infinity', value: '\\-Infinity' },
            { name: '-2147483648/-1', value: '\\-2147483648/-1' }
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

        const wackyStringsWithoutSpecialMarkdownCharacter = [
            { name: '<button></button>' },
            { name: 'null' },
            { name: 'undefined' },
            { name: 'null' },
            { name: 'NaN' },
            { name: 'Infinity' },
            { name: '\x00' },
            { name: '田' },
            { name: 'Ω' },
            { name: '( ͡° ͜ʖ ͡°)' },
            { name: '😍' },
            { name: 'Iñtërnâtiônàlizætiøn☃💩' },
            { name: '１' }
        ];

        wackyStringsWithoutSpecialMarkdownCharacter
            .filter(value => value.name !== '\x00')
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

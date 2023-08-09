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

    it('should have either one of the list buttons checked at the same time', async () => {
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
});

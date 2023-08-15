import { html } from '@microsoft/fast-element';
import { keySpace, keyEnter, keyTab } from '@microsoft/fast-web-utilities';
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

    it('should set aria-multiline to true', () => {
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
                    const spy = jasmine.createSpy();
                    const event = new Event('change', { bubbles: true });

                    buttonParent?.addEventListener('change', spy);
                    button.dispatchEvent(event);

                    expect(spy).toHaveBeenCalledTimes(0);
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

        it('should have multiple "ol" tag names for numbered list button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('numbered-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'numbered list 1';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const event = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(event);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'numbered list 2';
            await waitForUpdatesAsync();

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
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('numbered-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'List';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested List';
            await waitForUpdatesAsync();

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
            expect(button.checked).toBeTrue();
        });

        it('should have "ol" tag names for numbered lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('numbered-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'List';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested List';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual([
                'OL',
                'LI',
                'P',
                'OL',
                'LI',
                'P'
            ]);

            const shiftTabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(shiftTabEvent);
            await waitForUpdatesAsync();

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
            expect(button.checked).toBeTrue();
        });

        it('should have "ol" tag name for numbered list and "ul" tag name for nested bullet list', async () => {
            await waitForUpdatesAsync();
            const numberedListButton = pageObject.getFormattingButton('numbered-list')!;
            const bulletListButton = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'Numbered List';
            await waitForUpdatesAsync();
            numberedListButton.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            bulletListButton.click();
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested Bullet List';
            await waitForUpdatesAsync();

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
            expect(numberedListButton.checked).toBeTrue();
            expect(bulletListButton.checked).toBeTrue();
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

        it('should have multiple "ul" tag names for bullet list button click', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'bullet list 1';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const event = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(event);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'bullet list 2';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'LI',
                'P'
            ]);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'bullet list 1',
                'bullet list 2'
            ]);
        });

        it('should have "ul" tag names for nested bullet lists when clicking "tab"', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'List';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested List';
            await waitForUpdatesAsync();

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
            expect(button.checked).toBeTrue();
        });

        it('should have "ul" tag name for bullet list and "ol" tag name for nested numbered list', async () => {
            await waitForUpdatesAsync();
            const numberedListButton = pageObject.getFormattingButton('numbered-list')!;
            const bulletListButton = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'Bullet List';
            await waitForUpdatesAsync();
            bulletListButton.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            numberedListButton.click();
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested Numbered List';
            await waitForUpdatesAsync();

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
            expect(numberedListButton.checked).toBeTrue();
            expect(bulletListButton.checked).toBeTrue();
        });

        it('should have "ul" tag names for bullet lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await waitForUpdatesAsync();
            const button = pageObject.getFormattingButton('bullet-list')!;
            const editor = pageObject.getTiptapEditor()!;

            editor.textContent = 'List';
            await waitForUpdatesAsync();
            button.click();
            await waitForUpdatesAsync();
            const enterEvent = new KeyboardEvent('keydown', {
                key: keyEnter,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(enterEvent);
            await waitForUpdatesAsync();
            const tabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(tabEvent);
            await waitForUpdatesAsync();
            pageObject.getEditorLastChildElement()!.parentElement!.textContent = 'Nested List';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual([
                'UL',
                'LI',
                'P',
                'UL',
                'LI',
                'P'
            ]);

            const shiftTabEvent = new KeyboardEvent('keydown', {
                key: keyTab,
                shiftKey: true,
                bubbles: true,
                cancelable: true
            });
            editor.dispatchEvent(shiftTabEvent);
            await waitForUpdatesAsync();

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
            expect(button.checked).toBeTrue();
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

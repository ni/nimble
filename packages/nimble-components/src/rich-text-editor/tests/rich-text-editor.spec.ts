import { html } from '@microsoft/fast-element';
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

    it('should have a slot and part named "footer-actions"', () => {
        expect(pageObject.getSlotName()).toBe('footer-actions');
        expect(pageObject.getSlotPartName()).toBe('footer-actions');
    });

    it('should have either one of the list buttons checked at the same time on click', async () => {
        await waitForUpdatesAsync();
        expect(pageObject.getButtonCheckedState('bullet-list')).toBeFalse();
        expect(pageObject.getButtonCheckedState('numbered-list')).toBeFalse();

        await pageObject.clickBulletListButton();
        expect(pageObject.getButtonCheckedState('bullet-list')).toBeTrue();
        expect(pageObject.getButtonCheckedState('numbered-list')).toBeFalse();

        await pageObject.clickNumberedListButton();
        expect(pageObject.getButtonCheckedState('bullet-list')).toBeFalse();
        expect(pageObject.getButtonCheckedState('numbered-list')).toBeTrue();
    });

    const formattingButtons: {
        name: string,
        className: string,
        iconName: string,
        shortcutKey: string,
        shiftKey: boolean
    }[] = [
        {
            name: 'bold',
            className: 'bold',
            iconName: 'NIMBLE-ICON-BOLD-B',
            shortcutKey: 'b',
            shiftKey: false
        },
        {
            name: 'italics',
            className: 'italics',
            iconName: 'NIMBLE-ICON-ITALIC-I',
            shortcutKey: 'i',
            shiftKey: false
        },
        {
            name: 'bullet-list',
            className: 'bullet-list',
            iconName: 'NIMBLE-ICON-LIST',
            shortcutKey: '8',
            shiftKey: true
        },
        {
            name: 'numbered-list',
            className: 'numbered-list',
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
                    expect(
                        pageObject.getButtonContentHiddenState(value.className)
                    ).toBeTrue();
                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeFalse();
                    expect(
                        pageObject.getButtonAppearance(value.className)
                    ).toBe('ghost');
                    expect(pageObject.getButtonSlotName(value.className)).toBe(
                        'start'
                    );
                    expect(
                        pageObject.getButtonIconTagName(value.className)
                    ).toBe(value.iconName);
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
                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeFalse();

                    await pageObject.clickFooterButton(value.className);

                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeTrue();
                    expect(pageObject.getButtonTabIndex(value.className)).toBe(
                        0
                    );
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
                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeFalse();

                    pageObject.spaceKeyActivatesButton(value.className);

                    expect(
                        pageObject.getButtonCheckedState(value.className)
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
                async () => {
                    await waitForUpdatesAsync();
                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeFalse();

                    pageObject.enterKeyActivatesButton(value.className);

                    expect(
                        pageObject.getButtonCheckedState(value.className)
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
                    await waitForUpdatesAsync();
                    expect(
                        pageObject.getButtonCheckedState(value.className)
                    ).toBeFalse();

                    await pageObject.clickEditorShortcutKeys(
                        value.shortcutKey,
                        value.shiftKey
                    );

                    expect(
                        pageObject.getButtonCheckedState(value.className)
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
                    const button = element.shadowRoot?.querySelector(
                        `.${value.className}`
                    );
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
            await waitForUpdatesAsync();

            await pageObject.clickBoldButton();
            await pageObject.setEditorTextContent('bold');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'STRONG']);
            expect(pageObject.getEditorLeafContents()).toEqual(['bold']);
        });

        it('should have "em" tag name for italics button click', async () => {
            await waitForUpdatesAsync();

            await pageObject.clickItalicsButton();
            await pageObject.setEditorTextContent('italics');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'EM']);
            expect(pageObject.getEditorLeafContents()).toEqual(['italics']);
        });

        it('should have "ol" tag name for numbered list button click', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('numbered list');
            await pageObject.clickNumberedListButton();

            expect(pageObject.getEditorTagNames()).toEqual(['OL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'numbered list'
            ]);
        });

        it('should have multiple "ol" tag names for numbered list button click', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('numbered list 1');
            await pageObject.clickNumberedListButton();
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
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('List');
            await pageObject.clickNumberedListButton();
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
                pageObject.getButtonCheckedState('numbered-list')
            ).toBeTrue();
        });

        it('should have "ol" tag names for numbered lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('List');
            await pageObject.clickNumberedListButton();
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
                pageObject.getButtonCheckedState('numbered-list')
            ).toBeTrue();
        });

        it('should have "ol" tag name for numbered list and "ul" tag name for nested bullet list', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('Numbered List');
            await pageObject.clickNumberedListButton();
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.clickBulletListButton();
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
                pageObject.getButtonCheckedState('numbered-list')
            ).toBeTrue();
            expect(pageObject.getButtonCheckedState('bullet-list')).toBeTrue();
        });

        it('should have "ul" tag name for bullet list button click', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('Bullet List');
            await pageObject.clickBulletListButton();

            expect(pageObject.getEditorTagNames()).toEqual(['UL', 'LI', 'P']);
            expect(pageObject.getEditorLeafContents()).toEqual(['Bullet List']);
        });

        it('should have multiple "ul" tag names for bullet list button click', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('Bullet List 1');
            await pageObject.clickBulletListButton();
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
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('List');
            await pageObject.clickBulletListButton();
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
            expect(pageObject.getButtonCheckedState('bullet-list')).toBeTrue();
        });

        it('should have "ul" tag name for bullet list and "ol" tag name for nested numbered list', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('Bullet List');
            await pageObject.clickBulletListButton();
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.clickNumberedListButton();
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
                pageObject.getButtonCheckedState('numbered-list')
            ).toBeTrue();
            expect(pageObject.getButtonCheckedState('bullet-list')).toBeTrue();
        });

        it('should have "ul" tag names for bullet lists when clicking "tab" to make it nested and "shift+Tab" to make it usual list', async () => {
            await waitForUpdatesAsync();

            await pageObject.setEditorTextContent('List');
            await pageObject.clickBulletListButton();
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
            expect(pageObject.getButtonCheckedState('bullet-list')).toBeTrue();
        });

        it('should have "strong" and "em" tag name for both bold and italics button clicks', async () => {
            await waitForUpdatesAsync();

            await pageObject.clickBoldButton();
            await pageObject.clickItalicsButton();
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
            await waitForUpdatesAsync();

            await pageObject.clickBoldButton();
            await pageObject.clickItalicsButton();
            await pageObject.setEditorTextContent(
                'bold, italics and numbered list'
            );
            await pageObject.clickNumberedListButton();

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

            await pageObject.clickBoldButton();
            await pageObject.clickItalicsButton();
            await pageObject.setEditorTextContent(
                'bold, italics and bullet list'
            );
            await pageObject.clickBulletListButton();

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
});

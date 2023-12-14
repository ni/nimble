import { html } from '@microsoft/fast-element';
import type { RichTextEditor } from '../../editor';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { RichTextEditorPageObject } from '../../editor/testing/rich-text-editor.pageobject';
import { ToolbarButton } from '../../editor/testing/types';
import {
    appendTestMentionConfiguration,
    appendUserMentionConfiguration
} from '../../editor/testing/rich-text-editor-utils';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

async function setup(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        html`<nimble-rich-text-editor></nimble-rich-text-editor>`
    );
}

describe('Markdown serializer', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    const commitFirstMentionBoxOptionIntoEditor = async function (
        character: string
    ): Promise<void> {
        await pageObject.setEditorTextContent(character);
        await waitForUpdatesAsync();
        await pageObject.clickMentionListboxOption(0);
    };

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    describe('Serialize rich text editor content to its respective markdown', () => {
        const r = String.raw;

        it('Bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold');

            expect(element.getMarkdown()).toEqual('**Bold**');
        });

        it('Italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics');

            expect(element.getMarkdown()).toEqual('*Italics*');
        });

        it('Link', async () => {
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            expect(element.getMarkdown()).toEqual('<https://nimble.ni.dev> ');
        });

        it('Bold and Italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Bold and Italics');
            expect(element.getMarkdown()).toEqual('***Bold and Italics***');
        });

        it('Italics without spaces in between bold texts', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold');
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('italics');
            await pageObject.toggleFooterButton(ToolbarButton.italics, false);
            await pageObject.setEditorTextContent('bold');
            expect(element.getMarkdown()).toEqual('**Bold*italics*bold**');
        });

        it('Italics with leading and trailing spaces in between bold texts', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold ');
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('italics');
            await pageObject.toggleFooterButton(ToolbarButton.italics, false);
            await pageObject.setEditorTextContent(' bold');
            expect(element.getMarkdown()).toEqual('**Bold *italics* bold**');
        });

        it('Bold without spaces in between italics texts', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics');
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('bold');
            await pageObject.toggleFooterButton(ToolbarButton.bold, false);
            await pageObject.setEditorTextContent('italics');
            expect(element.getMarkdown()).toEqual('*Italics**bold**italics*');
        });

        it('Bold with leading and trailing spaces in between italics texts', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics ');
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('bold');
            await pageObject.toggleFooterButton(ToolbarButton.bold, false);
            await pageObject.setEditorTextContent(' italics');
            expect(element.getMarkdown()).toEqual('*Italics **bold** italics*');
        });

        it('Numbered list', async () => {
            await pageObject.setEditorTextContent('Numbered list');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            expect(element.getMarkdown()).toEqual('1. Numbered list');
        });

        it('Multiple Numbered list', async () => {
            await pageObject.setEditorTextContent('list 1');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('list 2');
            expect(element.getMarkdown()).toEqual(r`1. list 1

2. list 2`);
        });

        it('Numbered list with bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Numbered list with bold');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            expect(element.getMarkdown()).toEqual(
                '1. **Numbered list with bold**'
            );
        });

        it('Numbered list with italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Numbered list with italics');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            expect(element.getMarkdown()).toEqual(
                '1. *Numbered list with italics*'
            );
        });

        it('Numbered list with link', async () => {
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            expect(element.getMarkdown()).toEqual(
                '1. <https://nimble.ni.dev> '
            );
        });

        it('Bulleted list', async () => {
            await pageObject.setEditorTextContent('Bulleted list');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            expect(element.getMarkdown()).toEqual('* Bulleted list');
        });

        it('Multiple Bulleted list', async () => {
            await pageObject.setEditorTextContent('list 1');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('list 2');
            expect(element.getMarkdown()).toEqual(r`* list 1

* list 2`);
        });

        it('Bulleted list with bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bulleted list with bold');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            expect(element.getMarkdown()).toEqual(
                '* **Bulleted list with bold**'
            );
        });

        it('Bulleted list with italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Bulleted list with italics');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            expect(element.getMarkdown()).toEqual(
                '* *Bulleted list with italics*'
            );
        });

        it('Bulleted list with link', async () => {
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            expect(element.getMarkdown()).toEqual('* <https://nimble.ni.dev> ');
        });

        it('Toggling off Bulleted list with bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('List 1');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('list 2');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('plain text');
            expect(element.getMarkdown()).toEqual(r`* **List 1**

**list 2**plain text`);
        });

        it('Toggling off Numbered list with bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('List 1');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.setEditorTextContent('list 2');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('plain text');
            expect(element.getMarkdown()).toEqual(r`1. **List 1**

**list 2**plain text`);
        });

        it('Nested list with levels 1 - Bulleted list, 2 - Numbered list (Bold)', async () => {
            await pageObject.setEditorTextContent('Bulleted list');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Nested bold numbered list');
            expect(element.getMarkdown()).toEqual(r`* Bulleted list

  1. **Nested bold numbered list**`);
        });

        it('Nested list with levels 1 - Bulleted list, 2 - Numbered list (Italics)', async () => {
            await pageObject.setEditorTextContent('Bulleted list');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent(
                'Nested italics numbered list'
            );
            expect(element.getMarkdown()).toEqual(r`* Bulleted list

  1. *Nested italics numbered list*`);
        });

        it('Nested list with levels 1- Numbered list (Bold), 2-Bulleted list', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Numbered list bold');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.setEditorTextContent('Nested bulleted list');
            expect(element.getMarkdown()).toEqual(r`1. **Numbered list bold**

   * Nested bulleted list`);
        });

        it('Nested list with levels 1- Numbered list (Italics), 2-Bulleted list', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Numbered list italics');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.pressEnterKeyInEditor();
            await pageObject.pressTabKeyInEditor();
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.setEditorTextContent('Nested bulleted list');
            expect(element.getMarkdown()).toEqual(r`1. *Numbered list italics*

   * Nested bulleted list`);
        });

        it('Hard break', async () => {
            await pageObject.setEditorTextContent('Plain text 1');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Plain text 2');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Plain text 3');
            expect(element.getMarkdown()).toEqual(r`Plain text 1\
Plain text 2\
Plain text 3`);
        });

        it('Hard break with bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Bold');
            expect(element.getMarkdown()).toEqual(r`**Bold**\
**Bold**`);
        });

        it('Hard break with italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Italics');
            expect(element.getMarkdown()).toEqual(r`*Italics*\
*Italics*`);
        });

        it('Hard break with bulleted list', async () => {
            await pageObject.setEditorTextContent('Bulleted');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('list');
            expect(element.getMarkdown()).toEqual(r`* Bulleted\
  list`);
        });

        it('Hard break with numbered list', async () => {
            await pageObject.setEditorTextContent('Numbered');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('list');
            expect(element.getMarkdown()).toEqual(r`1. Numbered\
   list`);
        });

        it('Hard break with mention node', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.pressShiftEnterKeysInEditor();
            await commitFirstMentionBoxOptionIntoEditor('@');
            expect(element.getMarkdown()).toEqual(r`<user:1> \
<user:1> `);
        });

        it('Mention node', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            expect(element.getMarkdown()).toEqual('<user:1> ');
        });

        it('Multiple Mention node of same type', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.setEditorTextContent('@');
            await waitForUpdatesAsync();
            await pageObject.clickMentionListboxOption(1);
            expect(element.getMarkdown()).toEqual('<user:1> <user:2> ');
        });

        it('Multiple Mention node of different type', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            await appendTestMentionConfiguration(element, [
                { key: 'test:1', displayName: 'testname1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('!');
            expect(element.getMarkdown()).toEqual('<user:1><test:1> ');
        });

        it('Mention node between Bold text', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold ');
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('Bold ');
            expect(element.getMarkdown()).toEqual(
                '**Bold** <user:1> **Bold** '
            );
        });

        it('Mention node between Italics text', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics ');
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('Italics ');
            expect(element.getMarkdown()).toEqual(
                '*Italics* <user:1> *Italics* '
            );
        });

        it('Mention node under Numbered list', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.toggleFooterButton(ToolbarButton.numberedList);
            expect(element.getMarkdown()).toEqual('1. <user:1> ');
        });

        it('Mention node under Bulleted list', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await commitFirstMentionBoxOptionIntoEditor('@');
            await pageObject.toggleFooterButton(ToolbarButton.bulletList);
            expect(element.getMarkdown()).toEqual('* <user:1> ');
        });
    });

    describe('Includes other marks in link while serializing', () => {
        it('Link and Bold', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            expect(element.getMarkdown()).toEqual(
                '**<https://nimble.ni.dev>** '
            );
        });

        it('Link and Italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            expect(element.getMarkdown()).toEqual('*<https://nimble.ni.dev>* ');
        });

        it('Link, Bold and Italics', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            await pageObject.setEditorTextContent('https://nimble.ni.dev ');
            expect(element.getMarkdown()).toEqual(
                '***<https://nimble.ni.dev>*** '
            );
        });
    });
});

import { html } from '@microsoft/fast-element';
import { richTextEditorTag, type RichTextEditor } from '..';
import { type Fixture, fixture } from '../../utilities/tests/fixture';
import { themeProviderTag, type ThemeProvider } from '../../theme-provider';
import {
    LabelProviderRichTextEditor,
    labelProviderRichTextEditorTag
} from '../../label-provider/rich-text-editor';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { ToolbarButton } from '../testing/types';

async function setup(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(
        html`
      <${themeProviderTag}>
          <${labelProviderRichTextEditorTag}></${labelProviderRichTextEditorTag}>
          <${richTextEditorTag}></${richTextEditorTag}>
      <${themeProviderTag}>`
    );
}

describe('Rich Text Editor with LabelProviderRichTextEditor', () => {
    let element: RichTextEditor;
    let labelProvider: LabelProviderRichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        let themeProvider: ThemeProvider;
        ({ element: themeProvider, connect, disconnect } = await setup());
        element = themeProvider.querySelector(richTextEditorTag)!;
        labelProvider = themeProvider.querySelector(
            labelProviderRichTextEditorTag
        )!;
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('uses correct labels for bold button', async () => {
        await connect();
        labelProvider.toggleBold = 'Bold';
        const boldButton = pageObject.getFormattingButton(ToolbarButton.bold);
        expect(boldButton!.textContent!.trim()).toBe('Bold');
        expect(boldButton!.title).toBe('Bold');
    });

    it('uses correct labels for Italics button', async () => {
        await connect();
        labelProvider.toggleItalics = 'Italics';
        const italicButton = pageObject.getFormattingButton(
            ToolbarButton.italics
        );
        expect(italicButton!.textContent!.trim()).toBe('Italics');
        expect(italicButton!.title).toBe('Italics');
    });

    it('uses correct labels for bullet list button', async () => {
        await connect();
        labelProvider.toggleBulletList = 'Bullet List';
        const bulletListButton = pageObject.getFormattingButton(
            ToolbarButton.bulletList
        );
        expect(bulletListButton!.textContent!.trim()).toBe('Bullet List');
        expect(bulletListButton!.title).toBe('Bullet List');
    });

    it('uses correct labels for numbered list button', async () => {
        await connect();
        labelProvider.toggleNumberedList = 'Numbered List';
        const numberedListButton = pageObject.getFormattingButton(
            ToolbarButton.numberedList
        );
        expect(numberedListButton!.textContent!.trim()).toBe('Numbered List');
        expect(numberedListButton!.title).toBe('Numbered List');
    });
});

import { html } from '@microsoft/fast-element';
import { richTextEditorTag, type RichTextEditor } from '..';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { themeProviderTag, type ThemeProvider } from '../../../theme-provider';
import {
    LabelProviderRichText,
    labelProviderRichTextTag
} from '../../../label-provider/rich-text';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { LabelProvider, ToolbarButton } from '../testing/types';
import { getSpecTypeByNamedList } from '../../../utilities/tests/parameterized';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

async function setup(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(
        html`
      <${themeProviderTag}>
          <${labelProviderRichTextTag}></${labelProviderRichTextTag}>
          <${richTextEditorTag}></${richTextEditorTag}>
      <${themeProviderTag}>`
    );
}

const formattingButtons: {
    name: string,
    property: LabelProvider,
    label: string,
    toolbarButton: ToolbarButton
}[] = [
    {
        name: 'Bold',
        property: 'toggleBold',
        label: 'Customized Bold Label',
        toolbarButton: ToolbarButton.bold
    },
    {
        name: 'Italics',
        property: 'toggleItalics',
        label: 'Customized Italics Label',
        toolbarButton: ToolbarButton.italics
    },
    {
        name: 'BulletList',
        property: 'toggleBulletedList',
        label: 'Customized Bulleted List Label',
        toolbarButton: ToolbarButton.bulletList
    },
    {
        name: 'NumberedList',
        property: 'toggleNumberedList',
        label: 'Customized Numbered List Label',
        toolbarButton: ToolbarButton.numberedList
    }
];

describe('Rich Text Editor with LabelProviderRichText', () => {
    let element: RichTextEditor;
    let labelProvider: LabelProviderRichText;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;
    const focused: string[] = [];
    const disabled: string[] = [];

    beforeEach(async () => {
        let themeProvider: ThemeProvider;
        ({ element: themeProvider, connect, disconnect } = await setup());
        await connect();
        element = themeProvider.querySelector(richTextEditorTag)!;
        labelProvider = themeProvider.querySelector(labelProviderRichTextTag)!;
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    for (const value of formattingButtons) {
        const specType = getSpecTypeByNamedList(value, focused, disabled);
        specType(
            `uses correct label '${value.label}' for ${value.name} button`,
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            async () => {
                labelProvider[value.property] = value.label;
                await waitForUpdatesAsync();
                expect(
                    pageObject.getFormattingButtonTextContent(
                        value.toolbarButton
                    )
                ).toBe(value.label);
                expect(
                    pageObject.getFormattingButtonTitle(value.toolbarButton)
                ).toBe(value.label);
            }
        );
    }
});

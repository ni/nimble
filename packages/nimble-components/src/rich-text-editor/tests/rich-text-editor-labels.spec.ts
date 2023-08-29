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
import { getSpecTypeByNamedList } from '../../utilities/tests/parameterized';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

type LabelProvider = 'toggleBold' | 'toggleItalics' | 'toggleBulletList' | 'toggleNumberedList';

async function setup(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(
        html`
      <${themeProviderTag}>
          <${labelProviderRichTextEditorTag}></${labelProviderRichTextEditorTag}>
          <${richTextEditorTag}></${richTextEditorTag}>
      <${themeProviderTag}>`
    );
}

const formattingButtons: {
    name: string,
    property: LabelProvider,
    label: string,
    toolbarButtonIndex: ToolbarButton
}[] = [
    {
        name: 'Bold',
        property: 'toggleBold',
        label: 'Customized Bold Label',
        toolbarButtonIndex: ToolbarButton.bold,
    },
    {
        name: 'Italics',
        property: 'toggleItalics',
        label: 'Customized Italics Label',
        toolbarButtonIndex: ToolbarButton.italics,
    },
    {
        name: 'BulletList',
        property: 'toggleBulletList',
        label: 'Customized Bullet List Label',
        toolbarButtonIndex: ToolbarButton.bulletList,
    },
    {
        name: 'NumberedList',
        property: 'toggleNumberedList',
        label: 'Customized Numbered List Label',
        toolbarButtonIndex: ToolbarButton.numberedList,
    }
];

describe('Rich Text Editor with LabelProviderRichTextEditor', () => {
    let element: RichTextEditor;
    let labelProvider: LabelProviderRichTextEditor;
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
        labelProvider = themeProvider.querySelector(
            labelProviderRichTextEditorTag
        )!;
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    for (const value of formattingButtons) {
        const specType = getSpecTypeByNamedList(value, focused, disabled);
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        specType(
            `uses correct labels '${value.label}' for ${value.name} button`,
            // eslint-disable-next-line @typescript-eslint/no-loop-func
            async () => {
                labelProvider[value.property] = value.label;
                await waitForUpdatesAsync();
                const formatButton = pageObject.getFormattingButton(value.toolbarButtonIndex);
                expect(formatButton!.textContent!.trim()).toBe(value.label);
                expect(formatButton!.title).toBe(value.label);
            }
        );
    }
});

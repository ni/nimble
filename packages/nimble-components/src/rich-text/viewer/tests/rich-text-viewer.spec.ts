import { html } from '@microsoft/fast-element';
import { RichTextViewer, richTextViewerTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { RichTextViewerPageObject } from '../testing/rich-text-viewer.pageobject';

async function setup(): Promise<Fixture<RichTextViewer>> {
    return fixture<RichTextViewer>(
        html`<nimble-rich-text-viewer></nimble-rich-text-viewer>`
    );
}

describe('RichTextViewer', () => {
    let element: RichTextViewer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextViewerPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new RichTextViewerPageObject(element);
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-viewer')
        ).toBeInstanceOf(RichTextViewer);
    });

    it('should export its tag', () => {
        expect(richTextViewerTag).toBe('nimble-rich-text-viewer');
    });

    it('set the markdown attribute and ensure the markdown property is not modified', async () => {
        await connect();

        element.setAttribute('markdown', '**markdown string**');

        expect(element.markdown).toBe('');

        await disconnect();
    });

    it('set the markdown property and ensure there is no markdown attribute', async () => {
        await connect();

        element.markdown = '**markdown string**';

        expect(element.hasAttribute('markdown')).toBeFalse();

        await disconnect();
    });

    it('set the markdown property and ensure that getting the markdown property returns the same value', async () => {
        await connect();

        element.markdown = '**markdown string**';

        expect(element.markdown).toBe('**markdown string**');

        await disconnect();
    });

    it('set a empty string should clear a value in the viewer', async () => {
        await connect();

        element.markdown = 'markdown string';
        expect(pageObject.getRenderedMarkdownTagNames()).toEqual(['P']);
        expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
            'markdown string'
        );

        element.markdown = '';
        expect(pageObject.getRenderedMarkdownTagNames()).toEqual([]);
        expect(pageObject.getRenderedMarkdownLastChildContents()).toBe('');

        element.markdown = 'new markdown string';
        expect(pageObject.getRenderedMarkdownTagNames()).toEqual(['P']);
        expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
            'new markdown string'
        );

        await disconnect();
    });
});

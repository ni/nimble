import { html, ref, repeat } from '@microsoft/fast-element';
import { RichTextMentionListbox, richTextMentionListboxTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { listOptionTag } from '../../../list-option';
import {
    waitForEvent,
    waitAnimationFrame
} from '../../../utilities/testing/component';
import { checkFullyInViewport } from '../../../utilities/tests/intersection-observer';

describe('RichTextMentionListbox', () => {
    it('should export its tag', () => {
        expect(richTextMentionListboxTag).toBe(
            'nimble-rich-text-mention-listbox'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-mention-listbox')
        ).toBeInstanceOf(RichTextMentionListbox);
    });

    class Model {
        public mentionListbox!: RichTextMentionListbox;
        public anchorDiv!: HTMLDivElement;
    }

    async function setup500Options(
        source: Model
    ): Promise<Fixture<RichTextMentionListbox>> {
        // prettier-ignore
        return fixture<RichTextMentionListbox>(
            html<Model>`
            <div>
                <div ${ref('anchorDiv')}></div>
                <${richTextMentionListboxTag} ${ref('mentionListbox')}>
                    ${repeat(() => [...Array(500).keys()], html<number>`
                        <${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
                </${richTextMentionListboxTag}>
            </div>`,
            { source }
        );
    }

    let element: RichTextMentionListbox;
    let anchor: HTMLElement;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    async function waitForSelectionUpdateAsync(): Promise<void> {
        await waitForUpdatesAsync();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    async function showAndWaitForOpen(filter = ''): Promise<void> {
        const regionLoadedPromise = waitForEvent(element, 'loaded');
        element.show({
            anchorNode: anchor,
            filter
        });
        await regionLoadedPromise;
    }

    beforeEach(async () => {
        const model = new Model();
        ({ connect, disconnect } = await setup500Options(model));
        element = model.mentionListbox;
        anchor = model.anchorDiv;
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    // Intermittent, see: https://github.com/ni/nimble/issues/2274
    it('should scroll the selected option into view when opened #SkipWebkit', async () => {
        await showAndWaitForOpen();
        await waitForSelectionUpdateAsync(); // showing filters the options and modifies the selection

        element.selectedIndex = 300;
        await waitForSelectionUpdateAsync();
        expect(element.scrollableRegion.scrollTop).toBeGreaterThan(8000);

        element.selectedIndex = 0;
        await waitForSelectionUpdateAsync();
        expect(element.scrollableRegion.scrollTop).toBeCloseTo(0);
    });

    // Intermittent, see: https://github.com/ni/nimble/issues/2269
    it('should limit dropdown height to viewport #SkipWebkit', async () => {
        element.listbox.style.setProperty(
            '--ni-private-listbox-visible-option-count',
            '10000'
        );
        await showAndWaitForOpen();
        const fullyVisible = await checkFullyInViewport(element.listbox);

        expect(element.scrollableRegion.scrollHeight).toBeGreaterThan(
            window.innerHeight
        );
        expect(fullyVisible).toBe(true);

        await disconnect();
    });

    it('does not show "no items found" in dropdown when no filter', async () => {
        await showAndWaitForOpen();
        expect(element.listbox.querySelector('.no-results-label')).toBeNull();
    });

    it('does not show "no items found" in dropdown when something matches filter', async () => {
        await showAndWaitForOpen('1');
        expect(element.listbox.querySelector('.no-results-label')).toBeNull();
    });

    it('shows "no items found" in dropdown when nothing matches filter', async () => {
        await showAndWaitForOpen('zzz');
        expect(
            element.listbox.querySelector('.no-results-label')
        ).toBeDefined();
    });
});

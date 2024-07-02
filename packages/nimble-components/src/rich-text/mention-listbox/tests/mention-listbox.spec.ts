import { html, ref, repeat } from '@microsoft/fast-element';
import { RichTextMentionListbox, richTextMentionListboxTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { listOptionTag } from '../../../list-option';
import {
    createEventListener,
    waitAnimationFrame
} from '../../../utilities/tests/component';
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

    async function waitForSelectionUpdateAsync(): Promise<void> {
        await waitForUpdatesAsync();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    async function showAndWaitForOpen(
        listbox: RichTextMentionListbox,
        anchor: HTMLElement
    ): Promise<void> {
        const regionLoadedListener = createEventListener(listbox, 'loaded');
        listbox.show({
            anchorNode: anchor,
            filter: ''
        });
        await regionLoadedListener.promise;
    }

    // Intermittent: see https://github.com/ni/nimble/issues/1891
    xit('should scroll the selected option into view when opened', async () => {
        const model = new Model();
        const { connect, disconnect } = await setup500Options(model);
        await connect();
        await showAndWaitForOpen(model.mentionListbox, model.anchorDiv);
        await waitForSelectionUpdateAsync(); // showing filters the options and modifies the selection

        model.mentionListbox.selectedIndex = 300;
        await waitForSelectionUpdateAsync();
        const listbox = model.mentionListbox.region!.querySelector('.listbox')!;
        expect(listbox.scrollTop).toBeGreaterThan(8000);

        model.mentionListbox.selectedIndex = 0;
        await waitForSelectionUpdateAsync();
        expect(listbox.scrollTop).toBeCloseTo(4);

        await disconnect();
    });

    fit('should limit dropdown height to viewport', async () => {
        const model = new Model();
        const { connect, disconnect } = await setup500Options(model);
        await connect();
        await showAndWaitForOpen(model.mentionListbox, model.anchorDiv);
        model.mentionListbox.listbox.style.setProperty(
            '--ni-private-listbox-num-visible-options',
            '10000'
        );
        const fullyVisible = await checkFullyInViewport(
            model.mentionListbox.listbox
        );

        expect(model.mentionListbox.listbox.scrollHeight).toBeGreaterThan(
            window.innerHeight
        );
        expect(fullyVisible).toBe(true);

        await disconnect();
    });
});

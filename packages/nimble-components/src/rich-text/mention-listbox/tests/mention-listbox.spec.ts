import { html, repeat } from '@microsoft/fast-element';
import { RichTextMentionListbox, richTextMentionListboxTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { waitAnimationFrame } from '../../../utilities/tests/component';
import { listOptionTag } from '../../../list-option';

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

    async function setup500Options(): Promise<Fixture<RichTextMentionListbox>> {
        // prettier-ignore
        const viewTemplate = html`
            <${richTextMentionListboxTag}>
                ${repeat(() => [...Array(500).keys()], html<number>`
                    <${listOptionTag} value="${x => x}">${x => x}</${listOptionTag}>`)}
            </${richTextMentionListboxTag}>
        `;
        return fixture<RichTextMentionListbox>(viewTemplate);
    }

    async function waitForSelectionUpdateAsync(): Promise<void> {
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    it('should scroll the selected option into view when opened', async () => {
        const { element, connect, disconnect } = await setup500Options();
        await connect();
        element.show({
            anchorNode: document.documentElement,
            filter: ''
        });
        await waitForSelectionUpdateAsync(); // showing filters the options and modifies the selection

        element.selectedIndex = 300;
        await waitForSelectionUpdateAsync();
        const listbox = element.region!.querySelector('.listbox')!;
        expect(listbox.scrollTop).toBeGreaterThan(8000);

        element.selectedIndex = 0;
        await waitForSelectionUpdateAsync();
        expect(listbox.scrollTop).toBeCloseTo(4);

        await disconnect();
    });
});

import { html, ref, repeat } from '@microsoft/fast-element';
import { RichTextMentionListbox, richTextMentionListboxTag } from '..';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
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
        await waitForUpdatesAsync();
    }

    it('should scroll the selected option into view when opened', async () => {
        const model = new Model();
        const { connect, disconnect } = await setup500Options(model);
        await connect();
        model.mentionListbox.show({
            anchorNode: model.anchorDiv,
            filter: ''
        });
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
});

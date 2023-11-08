import { html } from '@microsoft/fast-element';
import { RichTextMentionUsersView, richTextMentionUsersViewTag } from '..';
import { type Fixture, fixture } from '../../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../../testing/async-helpers';

async function setup(): Promise<Fixture<RichTextMentionUsersView>> {
    return fixture<RichTextMentionUsersView>(
        html`<nimble-rich-text-mention-users-view
            mention-href="users:1"
            mention-label="John Doe"
            disable-editing
            >@John Doe</nimble-rich-text-mention-users-view
        >`
    );
}

describe('RichTextMentionUsersView', () => {
    let element: RichTextMentionUsersView;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(richTextMentionUsersViewTag).toBe(
            'nimble-rich-text-mention-users-view'
        );
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-mention-users-view')
        ).toBeInstanceOf(RichTextMentionUsersView);
    });

    it('should set the "control" class on the internal control', async () => {
        await connect();
        expect(
            element.shadowRoot?.firstElementChild?.classList.contains('control')
        ).toBeTrue();
    });

    it('should set the `part` attribute to "control" on the internal control', async () => {
        await connect();
        expect(
            element.shadowRoot?.firstElementChild?.part.contains('control')
        ).toBeTrue();
    });

    it('should set the `mention-label` attribute to the internal control text content', async () => {
        await connect();
        expect(element.shadowRoot?.firstElementChild?.textContent).toBe(
            'John Doe'
        );
        element.setAttribute('mention-label', 'Name Change');

        await waitForUpdatesAsync();
        expect(element.shadowRoot?.firstElementChild?.textContent).toBe(
            'Name Change'
        );
    });
});

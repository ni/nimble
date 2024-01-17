import { html } from '@microsoft/fast-element';
import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { RichTextMentionUsersView, richTextMentionUsersViewTag } from '..';
import { type Fixture, fixture } from '../../../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../../../testing/async-helpers';
import { RichTextMentionUsersViewPageObject } from '../testing/rich-text-mention-users-view.pageobject';
import { wackyStrings } from '../../../../utilities/tests/wacky-strings';

async function setup(): Promise<Fixture<RichTextMentionUsersView>> {
    return fixture<RichTextMentionUsersView>(
        html`<${richTextMentionUsersViewTag}
            mention-href="users:1"
            mention-label="John Doe"
            >@John Doe</${richTextMentionUsersViewTag}
        >`
    );
}

describe('RichTextMentionUsersView', () => {
    let element: RichTextMentionUsersView;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextMentionUsersViewPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new RichTextMentionUsersViewPageObject(element);
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
            document.createElement(richTextMentionUsersViewTag)
        ).toBeInstanceOf(RichTextMentionUsersView);
    });

    it('should change the text content if the `mention-label` attribute updates', async () => {
        await connect();
        expect(pageObject.getTextContent()).toBe('@John Doe');
        element.setAttribute('mention-label', 'Name Change');

        await waitForUpdatesAsync();
        expect(pageObject.getTextContent()).toBe('@Name Change');
    });

    describe('various wacky strings should reflect the `mention-label` attribute value to its text content', () => {
        parameterizeSpec(wackyStrings, (spec, name) => {
            spec(`for ${name}`, async () => {
                await connect();
                element.setAttribute('mention-label', name);

                await waitForUpdatesAsync();
                expect(pageObject.getTextContent()).toBe(`@${name}`);
            });
        });
    });
});

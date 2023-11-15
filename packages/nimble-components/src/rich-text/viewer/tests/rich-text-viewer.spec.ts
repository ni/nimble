import { html } from '@microsoft/fast-element';
import { RichTextViewer, richTextViewerTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { RichTextViewerPageObject } from '../testing/rich-text-viewer.pageobject';
import { anchorTag } from '../../../anchor';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import {
    RichTextMentionUsers,
    richTextMentionUsersTag
} from '../../../rich-text-mention/users';
import { richTextMentionUsersViewTag } from '../../../rich-text-mention/users/view';
import { MappingUser, mappingUserTag } from '../../../mapping/user';

async function setup(): Promise<Fixture<RichTextViewer>> {
    return fixture<RichTextViewer>(
        html`<nimble-rich-text-viewer></nimble-rich-text-viewer>`
    );
}

async function appendUserMentionConfiguration(
    element: RichTextViewer,
    userKey: string | undefined,
    displayName: string | undefined
): Promise<void> {
    const userMention = document.createElement(
        richTextMentionUsersTag
    ) as RichTextMentionUsers;
    userMention.pattern = '^user:(.*)';

    if (userKey || displayName) {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
        mappingUser.key = userKey ?? '';
        mappingUser.displayName = displayName ?? '';
        userMention.appendChild(mappingUser);
    }
    element.appendChild(userMention);
    await waitForUpdatesAsync();
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

    describe('User mention', () => {
        beforeEach(async () => {
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('adding mention configuration converts the absolute link matching the pattern to mention node', async () => {
            element.markdown = '<user:1>';

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:1'
            );
            await appendUserMentionConfiguration(element, undefined, undefined);

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('1');
        });

        it('adding mention mapping renders the mapped display name', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                'user:1',
                'username1'
            );

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('username1');
        });

        it('removing configuration element renders the mention node as absolute link', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                'user:1',
                'username1'
            );

            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            element.removeChild(renderedUserMention);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:1'
            );
        });

        it('removing mapping element renders the mention node with user ID', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                'user:1',
                'username1'
            );

            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            const renderedMappingUser = renderedUserMention.firstElementChild as MappingUser;
            renderedUserMention.removeChild(renderedMappingUser);
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('1');
        });

        it('updating to invalid `pattern` in mention configuration converts it to absolute link', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                'user:1',
                'username1'
            );

            (element.firstElementChild as RichTextMentionUsers).pattern = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:1'
            );
        });

        it('updating `display-name` in mapping mention should update the `mention-label` in view', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                'user:1',
                'username1'
            );

            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            const renderedMappingUser = renderedUserMention.firstElementChild as MappingUser;
            renderedMappingUser.displayName = 'updated-name';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('updated-name');
        });

        it('updating valid `key` in mapping mention should update it to a mention view if is a absolute link before', async () => {
            element.markdown = '<user:2>';
            await appendUserMentionConfiguration(
                element,
                'invalid',
                'username'
            );

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:2'
            );

            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            const renderedMappingUser = renderedUserMention.firstElementChild as MappingUser;
            renderedMappingUser.key = 'user:2';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('username');
        });
    });
});

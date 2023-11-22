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
        html`<${richTextViewerTag}></${richTextViewerTag}>`
    );
}

async function setupMentionConfig(): Promise<Fixture<RichTextViewer>> {
    return fixture<RichTextViewer>(
        // prettier-ignore
        html`<${richTextViewerTag}>
            <${richTextMentionUsersTag} pattern="^user:(.*)">
                <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
                <${mappingUserTag} key="user:2" display-name="Mary Wilson"></${mappingUserTag}>
            </${richTextMentionUsersTag}>
        </${richTextViewerTag}>`
    );
}

async function appendUserMentionConfiguration(
    element: RichTextViewer,
    userKeys: string[] | undefined,
    displayNames: string[] | undefined
): Promise<void> {
    const userMention = document.createElement(
        richTextMentionUsersTag
    ) as RichTextMentionUsers;
    userMention.pattern = '^user:(.*)';

    if (userKeys || displayNames) {
        userKeys?.forEach((userKey, index) => {
            const mappingUser = document.createElement(
                mappingUserTag
            ) as MappingUser;
            mappingUser.key = userKey ?? '';
            mappingUser.displayName = displayNames?.[index] ?? '';
            userMention.appendChild(mappingUser);
        });
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
        expect(document.createElement(richTextViewerTag)).toBeInstanceOf(
            RichTextViewer
        );
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

    describe('user mention dynamic loading', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            pageObject = new RichTextViewerPageObject(element);
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

        // TODO: Once the rich text validator added for duplicate configuration elements, below test case should be updated
        it('adding two mention configuration elements in the same viewer should render as mention view', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, undefined, undefined);
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

        it('adding mention mapping elements renders the mapped display name', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                ['user:1'],
                ['username1']
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

        it('adding two mention mapping elements renders the mapped display names', async () => {
            element.markdown = '<user:1> <user:2>';
            await appendUserMentionConfiguration(
                element,
                ['user:1', 'user:2'],
                ['username1', 'username2']
            );

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase(),
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownAttributeValues('mention-label')
            ).toEqual(['username1', 'username2']);
        });

        it('removing configuration element renders the mention node as absolute link', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                ['user:1'],
                ['username1']
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
                ['user:1'],
                ['username1']
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

        it('updating to the `pattern` in mention configuration converts the mention to absolute link', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(
                element,
                ['user:1'],
                ['username1']
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
                ['user:1'],
                ['username1']
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

        it('updating valid `key` in mapping mention should update it to a mention view if it is a absolute link before', async () => {
            element.markdown = '<user:2>';
            await appendUserMentionConfiguration(
                element,
                ['invalid'],
                ['username']
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

    describe('user mention via template', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupMentionConfig());
            pageObject = new RichTextViewerPageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should render as mention view element when the input markdown matching the mention string with pattern', async () => {
            element.markdown = '<user:1>';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('John Doe');
        });

        it('should render as absolute link when the input markdown does not match with pattern', async () => {
            element.markdown = '<https://user/1>';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'https://user/1'
            );
        });

        it('should render as mention view elements when multiple mention strings are passed in the markdown string', async () => {
            element.markdown = '<user:1> <user:2>';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase(),
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownAttributeValues('mention-label')
            ).toEqual(['John Doe', 'Mary Wilson']);
        });
    });

    describe('getMentionedHref() for viewer mentions', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            pageObject = new RichTextViewerPageObject(element);
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('getMentionedHref() method should return the mentioned href when it valid mention configuration matching the pattern to mention node', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, undefined, undefined);
            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            expect(renderedUserMention.getMentionedHref()).toEqual(['user:1']);
        });

        it('getMentionedHref() should be empty for duplicate mention configuration elements', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, undefined, undefined);
            await appendUserMentionConfiguration(element, undefined, undefined);
            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            expect(renderedUserMention.getMentionedHref()).toEqual([]);
        });

        it('getMentionedHref() method should return all the mentioned href', async () => {
            element.markdown = '<user:1> <user:2>';
            await appendUserMentionConfiguration(element, undefined, undefined);
            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            expect(renderedUserMention.getMentionedHref()).toEqual([
                'user:1',
                'user:2'
            ]);
        });

        it('getMentionedHref() method should return empty when removing configuration element in the same viewer', async () => {
            element.markdown = '<user:1> <user:2>';
            await appendUserMentionConfiguration(element, undefined, undefined);
            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            expect(renderedUserMention.getMentionedHref()).toEqual([
                'user:1',
                'user:2'
            ]);

            element.removeChild(renderedUserMention);
            await waitForUpdatesAsync();

            expect(renderedUserMention.getMentionedHref()).toEqual([]);
        });
    });
});

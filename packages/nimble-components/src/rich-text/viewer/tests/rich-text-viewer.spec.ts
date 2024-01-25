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
import type {
    MappingConfiguration,
    UserMentionElements
} from '../../editor/testing/types';

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
    mappings?: MappingConfiguration[]
): Promise<UserMentionElements> {
    const userMentionElement = document.createElement(richTextMentionUsersTag);
    userMentionElement.pattern = '^user:(.*)';
    const mappingElements: MappingUser[] = [];
    mappings?.forEach(mapping => {
        const mappingUser = document.createElement(mappingUserTag);
        mappingUser.key = mapping.key ?? '';
        mappingUser.displayName = mapping.displayName;
        userMentionElement.appendChild(mappingUser);
        mappingElements.push(mappingUser);
    });
    element.appendChild(userMentionElement);
    await waitForUpdatesAsync();
    return {
        userMentionElement,
        mappingElements
    };
}

describe('RichTextViewer', () => {
    let element: RichTextViewer;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextViewerPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new RichTextViewerPageObject(element);
        await connect();
        await waitForUpdatesAsync();
    });

    afterEach(async () => {
        await disconnect();
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
        element.setAttribute('markdown', '**markdown string**');

        expect(element.markdown).toBe('');
    });

    it('set the markdown property and ensure there is no markdown attribute', async () => {
        element.markdown = '**markdown string**';

        expect(element.hasAttribute('markdown')).toBeFalse();
    });

    it('set the markdown property and ensure that getting the markdown property returns the same value', async () => {
        element.markdown = '**markdown string**';

        expect(element.markdown).toBe('**markdown string**');
    });

    it('set a empty string should clear a value in the viewer', async () => {
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
    });

    describe('user mention dynamic loading', () => {
        it('adding mention configuration converts the absolute link matching the pattern to mention node', async () => {
            element.markdown = '<user:1>';

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:1'
            );
            await appendUserMentionConfiguration(element);

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

        it('adding duplicate mention configuration elements in the same viewer should not render as mention view', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element);
            await appendUserMentionConfiguration(element);

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
        });

        it('adding mention mapping elements renders the mapped display name', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

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
            await appendUserMentionConfiguration(element, [
                { key: 'invalid', displayName: 'username' }
            ]);

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

        it('updating invalid `key` in mapping mention should update it to absolute link if it is a mention before', async () => {
            element.markdown = '<user:2>';
            await appendUserMentionConfiguration(element, [
                { key: 'user:2', displayName: 'username' }
            ]);

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${richTextMentionUsersViewTag}`.toUpperCase()
            ]);
            expect(
                pageObject.getRenderedMarkdownLastChildAttribute(
                    'mention-label'
                )
            ).toEqual('username');

            const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
            const renderedMappingUser = renderedUserMention.firstElementChild as MappingUser;
            renderedMappingUser.key = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getRenderedMarkdownTagNames()).toEqual([
                'P',
                `${anchorTag}`.toUpperCase()
            ]);
            expect(pageObject.getRenderedMarkdownLastChildContents()).toBe(
                'user:2'
            );
        });

        describe('validity', () => {
            it('should have valid states by default', () => {
                expect(element.checkValidity()).toBeTrue();
                expect(
                    element.validity.invalidMentionConfiguration
                ).toBeFalse();
                expect(
                    element.validity.duplicateMentionConfiguration
                ).toBeFalse();
            });

            it('should have valid states when there is no mapping elements but with a configuration element', async () => {
                element.markdown = '<user:1>';
                await appendUserMentionConfiguration(element);

                expect(element.checkValidity()).toBeTrue();
                expect(
                    element.validity.invalidMentionConfiguration
                ).toBeFalse();
                expect(
                    element.validity.duplicateMentionConfiguration
                ).toBeFalse();
            });

            it('should have invalid states when setting invalid `key` in mapping mention', async () => {
                element.markdown = '<user:1>';
                await appendUserMentionConfiguration(element, [
                    { key: 'invalid', displayName: 'username' }
                ]);

                expect(element.checkValidity()).toBeFalse();
                expect(element.validity.invalidMentionConfiguration).toBeTrue();
            });

            it('should have invalid states when removing `pattern` from configuration element', async () => {
                element.markdown = '<user:1>';
                const { userMentionElement } = await appendUserMentionConfiguration(element, [
                    { key: 'user:1', displayName: 'username' }
                ]);
                userMentionElement.removeAttribute('pattern');
                await waitForUpdatesAsync();

                expect(element.checkValidity()).toBeFalse();
                expect(element.validity.invalidMentionConfiguration).toBeTrue();
            });

            it('should have invalid states when it is a invalid regex `pattern`', async () => {
                element.markdown = '<user:1>';
                const { userMentionElement } = await appendUserMentionConfiguration(element, [
                    { key: 'user:1', displayName: 'username' }
                ]);
                userMentionElement.pattern = '(invalid';
                await waitForUpdatesAsync();

                expect(element.checkValidity()).toBeFalse();
                expect(element.validity.invalidMentionConfiguration).toBeTrue();
            });

            it('should have invalid states when we have duplicate configuration element', async () => {
                element.markdown = '<user:1>';
                await appendUserMentionConfiguration(element, [
                    { key: 'user:1', displayName: 'username' }
                ]);
                await appendUserMentionConfiguration(element, [
                    { key: 'user:1', displayName: 'username' }
                ]);
                expect(element.checkValidity()).toBeFalse();
                expect(
                    element.validity.duplicateMentionConfiguration
                ).toBeTrue();
            });

            it('should have valid states when the duplicate configuration element removed', async () => {
                element.markdown = '<user:1>';
                await appendUserMentionConfiguration(element);
                await appendUserMentionConfiguration(element);

                const renderedUserMention = element.firstElementChild as RichTextMentionUsers;
                element.removeChild(renderedUserMention);
                await waitForUpdatesAsync();

                expect(element.checkValidity()).toBeTrue();
                expect(
                    element.validity.duplicateMentionConfiguration
                ).toBeFalse();
                expect(
                    element.validity.invalidMentionConfiguration
                ).toBeFalse();
            });
        });
    });

    describe('user mention via template', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setupMentionConfig());
            pageObject = new RichTextViewerPageObject(element);
            await connect();
            await waitForUpdatesAsync();
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
        it('should return different mentionedHrefs instance', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element);
            const firstInstance = element.getMentionedHrefs();
            const secondInstance = element.getMentionedHrefs();
            expect(firstInstance === secondInstance).toBeFalse();
        });

        it('should return the mentioned href when it valid mention configuration matching the pattern to mention node', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });

        it('should return empty mentioned href for duplicate mention configuration elements', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element);
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual([]);
        });

        it('should return unique mentioned href if same users exist twice', async () => {
            element.markdown = '<user:1> <user:1>';
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });

        it('should return all the mentioned href', async () => {
            element.markdown = '<user:1> <user:2>';
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1', 'user:2']);
        });

        it('should return updated href when mention configuration element pattern get updated', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const renderedUserMention = element.lastElementChild as RichTextMentionUsers;
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
            renderedUserMention.pattern = 'invalid';
            await waitForUpdatesAsync();
            expect(element.getMentionedHrefs()).toEqual([]);
        });

        it('should return updated href when mention configuration element added dynamically', async () => {
            element.markdown = '<user:1>';
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const renderedUserMention = element.lastElementChild as RichTextMentionUsers;
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
            element.removeChild(renderedUserMention);
            await waitForUpdatesAsync();
            expect(element.children.length).toBe(0);
            expect(element.getMentionedHrefs()).toEqual([]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });
    });
});

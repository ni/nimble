import { html } from '@microsoft/fast-element';
import { richTextEditorTag, RichTextEditor } from '..';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { parameterizeNamedList } from '../../../utilities/tests/parameterized';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import {
    RichTextMentionUsers,
    richTextMentionUsersTag
} from '../../../rich-text-mention/users';
import { MappingUser, mappingUserTag } from '../../../mapping/user';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { richTextMentionUsersViewTag } from '../../../rich-text-mention/users/view';
import { richTextMentionTestTag } from '../../../rich-text-mention/base/tests/rich-text-mention.fixtures';
import type {
    UserMentionElements,
    TestMentionElements,
    MappingConfiguration
} from '../testing/types';

const RICH_TEXT_MENTION_USERS_VIEW_TAG = richTextMentionUsersViewTag.toUpperCase();

async function setup(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        html`<nimble-rich-text-editor></nimble-rich-text-editor>`
    );
}

async function setupMentionConfig(): Promise<Fixture<RichTextEditor>> {
    return fixture<RichTextEditor>(
        // prettier-ignore
        html`<${richTextEditorTag}>
          <${richTextMentionUsersTag} pattern="^user:(.*)">
              <${mappingUserTag} key="user:1" display-name="John Doe"></${mappingUserTag}>
              <${mappingUserTag} key="user:2" display-name="Mary Wilson"></${mappingUserTag}>
          </${richTextMentionUsersTag}>
      </${richTextEditorTag}>`
    );
}

async function appendUserMentionConfiguration(
    element: RichTextEditor,
    mappings?: MappingConfiguration[]
): Promise<UserMentionElements> {
    const userMentionElement = document.createElement(
        richTextMentionUsersTag
    ) as RichTextMentionUsers;
    userMentionElement.pattern = '^user:(.*)';
    const mappingElements: MappingUser[] = [];
    mappings?.forEach(mapping => {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
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

async function appendTestMentionConfiguration(
    element: RichTextEditor,
    mappings?: MappingConfiguration[]
): Promise<TestMentionElements> {
    const testMentionElement = document.createElement(richTextMentionTestTag);
    testMentionElement.pattern = '^test:(.*)';
    const mappingElements: MappingUser[] = [];
    mappings?.forEach(mapping => {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
        mappingUser.key = mapping.key;
        mappingUser.displayName = mapping.displayName;
        testMentionElement.appendChild(mappingUser);
        mappingElements.push(mappingUser);
    });
    element.appendChild(testMentionElement);
    await waitForUpdatesAsync();
    return {
        testMentionElement,
        mappingElements
    };
}

describe('RichTextEditorMention', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new RichTextEditorPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should update "empty" when the mention is loaded with "setMarkdown"', async () => {
        expect(element.empty).toBeTrue();

        element.setMarkdown('<user:1>');

        await appendUserMentionConfiguration(element);
        expect(element.empty).toBeFalse();

        element.setMarkdown('');
        expect(element.empty).toBeTrue();
    });

    it('Should return same markdown when mention markdown string is assigned with valid configuration element', async () => {
        element.setMarkdown('<user:1>');
        await appendUserMentionConfiguration(element);
        expect(element.getMarkdown()).toBe('<user:1>');
    });

    it('Should return same markdown when mention markdown string is assigned without configuration element', () => {
        element.setMarkdown('<user:1>');
        expect(element.getMarkdown()).toBe('<user:1>');
    });

    it('Should return same markdown for assigned mention markdown when removing configuration element in the same editor', async () => {
        element.setMarkdown('<user:1>');
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        expect(element.getMarkdown()).toBe('<user:1>');
        element.removeChild(userMentionElement);
        await waitForUpdatesAsync();
        expect(element.getMarkdown()).toBe('<user:1>');
    });

    describe('user mention dynamic loading', () => {
        it('adding mention configuration converts the absolute link matching the pattern to mention node', async () => {
            element.setMarkdown('<user:1>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual(['user:1']);
            await appendUserMentionConfiguration(element);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['1']);
        });

        // TODO: Once the rich text validator (https://github.com/ni/nimble/pull/1688) added for duplicate configuration elements, below test case should be updated
        it('adding two mention configuration elements in the same editor should render as mention node', async () => {
            element.setMarkdown('<user:1>');
            await appendUserMentionConfiguration(element);
            await appendUserMentionConfiguration(element);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['1']);
        });

        it('adding mention mapping renders the mapped display name', async () => {
            element.setMarkdown('<user:1>');
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1']);
        });

        it('adding two mention mappings renders the mapped display names', async () => {
            element.setMarkdown('<user:1> <user:2>');
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'username2']);
        });

        it('removing configuration element renders the mention node as absolute link', async () => {
            element.setMarkdown('<user:1>');
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            element.removeChild(userMentionElement);
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual(['user:1']);
        });

        it('removing mapping element renders the mention node with user ID', async () => {
            element.setMarkdown('<user:1>');
            const { mappingElements, userMentionElement } = await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            userMentionElement.removeChild(mappingElements[0]!);
            await waitForUpdatesAsync();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['1']);
        });

        it('updating to invalid `pattern` in mention configuration converts it to absolute link', async () => {
            element.setMarkdown('<user:1>');
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );

            userMentionElement.pattern = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual(['user:1']);
        });

        it('updating `display-name` in mapping mention should update the `mention-label` in view', async () => {
            element.setMarkdown('<user:1>');
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            mappingElements[0]!.displayName = 'updated-name';
            await waitForUpdatesAsync();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['updated-name']);
        });

        it('updating valid `key` in mapping mention should update it to a mention view if is a absolute link before', async () => {
            element.setMarkdown('<user:2>');
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'invalid', displayName: 'username' }]
            );

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual(['user:2']);
            mappingElements[0]!.key = 'user:2';
            await waitForUpdatesAsync();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username']);
        });

        it('updating valid `key` in mapping mention should update it to absolute link if it is a mention before', async () => {
            element.setMarkdown('<user:2>');
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:2', displayName: 'username' }]
            );

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username']);
            mappingElements[0]!.key = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual(['user:2']);
        });
    });

    describe('Multiple mention elements dynamic loading', () => {
        it('should converts the absolute link matching the pattern to respective mention node when adding multiple mention configuration', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element);
            await appendTestMentionConfiguration(element);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['1', '2']);
        });

        it('Should render respective display name in mention node', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await appendTestMentionConfiguration(element, [
                { key: 'test:2', displayName: 'testname2' }
            ]);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);
        });

        it('Should render respective user ID for mention node when matches regex without mapping element', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await appendTestMentionConfiguration(element, []);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', '2']);
        });

        it('should not affect other mention nodes when removing one of the configuration element ', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const { testMentionElement } = await appendTestMentionConfiguration(
                element,
                [{ key: 'test:2', displayName: 'testname2' }]
            );

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);
            element.removeChild(testMentionElement);
            await waitForUpdatesAsync();
            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'A'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1']);
        });

        it('Should render respective user ID for mention node when removing mapping element from the configuration element', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const { mappingElements, testMentionElement } = await appendTestMentionConfiguration(element, [
                { key: 'test:2', displayName: 'testname2' }
            ]);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);
            testMentionElement.removeChild(mappingElements[0]!);
            await waitForUpdatesAsync();
            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', '2']);
        });

        it('Should converts mention configuration to absolute link when updating to invalid `pattern`', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const { testMentionElement } = await appendTestMentionConfiguration(
                element,
                [{ key: 'test:2', displayName: 'testname2' }]
            );

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);

            testMentionElement.pattern = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
        });

        it('Should update `mention-label` in respective view element when updating `display-name` in mapping mention of one configuration Element', async () => {
            element.setMarkdown('<user:1> <test:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const { mappingElements } = await appendTestMentionConfiguration(
                element,
                [{ key: 'test:2', displayName: 'testname2' }]
            );

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);

            mappingElements[0]!.displayName = 'updated-name';
            await waitForUpdatesAsync();

            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'updated-name']);
        });

        it('updating valid `key` in mapping mention should update it to a mention view if is a absolute link before', async () => {
            element.setMarkdown('<user:1> <test:2>');
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            const { mappingElements } = await appendTestMentionConfiguration(
                element,
                [{ key: 'invalid', displayName: 'testname2' }]
            );

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
            mappingElements[0]!.key = 'test:2';
            await waitForUpdatesAsync();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);
        });

        it('updating valid `key` in mapping mention should update it to absolute link if it is a mention before', async () => {
            element.setMarkdown('<user:1> <test:2>');
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            await appendTestMentionConfiguration(element, [
                { key: 'test:2', displayName: 'testname2' }
            ]);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                RICH_TEXT_MENTION_USERS_VIEW_TAG,
                'BR'
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1', 'testname2']);
            mappingElements[0]!.key = 'invalid';
            await waitForUpdatesAsync();

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);
            expect(pageObject.getEditorLeafContents()).toEqual([
                'user:1',
                'test:2'
            ]);
        });
    });

    it('should fire "mention-update" event from configuration elment when there is @mention in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('@test');
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event from configuration elment when there is update in @mention in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('@test');
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event from configuration elment when pasting @ in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        pageObject.pasteToEditor('@test');
        await waitForUpdatesAsync();
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event when deleting an existing @mention in editor', async () => {
        await pageObject.setEditorTextContent('@test');
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.sliceEditorContent(2);
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should not fire "mention-update" event when @ get removed in editor', async () => {
        await pageObject.setEditorTextContent('@test');
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.sliceEditorContent(5);
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(0);
    });

    it('should fire "mention-update" event with specific filter details from configuration elment when there is @mention in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('@test');
        expect(mentionUpdateSpy).toHaveBeenCalledOnceWith(
            jasmine.objectContaining({
                detail: { filter: 'test' }
            })
        );
    });

    describe('getMentionedHrefs() for editor current mentions', () => {
        it('should return different mentionedHrefs instance', async () => {
            element.setMarkdown('<user:1>');
            await appendUserMentionConfiguration(element);
            const firstInstance = element.getMentionedHrefs();
            const secondInstance = element.getMentionedHrefs();
            expect(firstInstance === secondInstance).toBeFalse();
        });

        it('should return the mentioned href when it valid mention configuration matching the pattern to mention node', async () => {
            element.setMarkdown('<user:1>');
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });

        // TODO: Once the rich text validator (https://github.com/ni/nimble/pull/1688) added for duplicate configuration elements, below test case should be updated
        it('should return the mentioned href for duplicate mention configuration elements', async () => {
            element.setMarkdown('<user:1>');
            await appendUserMentionConfiguration(element);
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });

        it('should return unique mentioned href if same users mentioned twice', async () => {
            element.setMarkdown('<user:1> <user:1>');
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });

        it('should return all the mentioned href', async () => {
            element.setMarkdown('<user:1> <user:2>');
            await appendUserMentionConfiguration(element);
            expect(element.getMentionedHrefs()).toEqual(['user:1', 'user:2']);
        });

        it('should return updated href when mention configuration element pattern get updated', async () => {
            element.setMarkdown('<user:1>');
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            await waitForUpdatesAsync();
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
            userMentionElement.pattern = 'invalid';
            expect(element.getMentionedHrefs()).toEqual([]);
        });

        it('should return updated href when mention configuration element added dynamically', async () => {
            element.setMarkdown('<user:1>');
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            await waitForUpdatesAsync();
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
            element.removeChild(userMentionElement);
            await waitForUpdatesAsync();
            expect(element.children.length).toBe(0);
            expect(element.getMentionedHrefs()).toEqual([]);
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            await waitForUpdatesAsync();
            expect(element.getMentionedHrefs()).toEqual(['user:1']);
        });
    });

    describe('pasting mention nodes should render as plain text', () => {
        const validMentionNodes = [
            {
                name: 'Mention Node',
                input: '<nimble-rich-text-mention-users-view mention-href="user:1" mention-label="User" disable-editing="true"></nimble-rich-text-mention-users-view>',
                textContent: 'User'
            },
            {
                name: 'Mention Node within paragraph node',
                input: '<p>Mention nodes between <nimble-rich-text-mention-users-view mention-href="user:1" mention-label="User" disable-editing="true"></nimble-rich-text-mention-users-view> text</p>',
                textContent: 'Mention nodes between User text'
            },
            {
                name: 'Mention Node within strong node',
                input: '<strong><nimble-rich-text-mention-users-view mention-href="user:1" mention-label="User" disable-editing="true"></nimble-rich-text-mention-users-view></strong>',
                textContent: 'User'
            },
            {
                name: 'Mention Node within italics node',
                input: '<em><nimble-rich-text-mention-users-view mention-href="user:1" mention-label="User" disable-editing="true"></nimble-rich-text-mention-users-view></em>',
                textContent: 'User'
            },
            {
                name: 'Mention Node within strong and italics node',
                input: '<strong><em><nimble-rich-text-mention-users-view mention-href="user:1" mention-label="User" disable-editing="true"></nimble-rich-text-mention-users-view></em></strong>',
                textContent: 'User'
            }
        ] as const;

        parameterizeNamedList(validMentionNodes, (spec, name, value) => {
            spec(`${name} renders as plain text in editor`, async () => {
                await appendUserMentionConfiguration(element);
                pageObject.pasteHTMLToEditor(value.input);
                expect(pageObject.getEditorTagNamesWithClosingTags()).toEqual([
                    'P',
                    '/P'
                ]);
                expect(pageObject.getEditorTextContents()).toEqual([
                    value.textContent
                ]);
            });
        });
    });
});

describe('RichTextEditor user mention via template', () => {
    let element: RichTextEditor;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RichTextEditorPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setupMentionConfig());
        pageObject = new RichTextEditorPageObject(element);
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should render as mention view element when the input markdown as matching mention string with pattern', async () => {
        element.setMarkdown('<user:1>');
        await waitForUpdatesAsync();

        expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
            'P',
            RICH_TEXT_MENTION_USERS_VIEW_TAG,
            'BR'
        ]);
        expect(
            pageObject.getEditorMentionViewAttributeValues('mention-label')
        ).toEqual(['John Doe']);
    });

    it('should render as absolute link when the input markdown does not match with pattern', async () => {
        element.setMarkdown('<https://user/1>');
        await waitForUpdatesAsync();

        expect(pageObject.getEditorTagNames()).toEqual(['P', 'A']);
        expect(pageObject.getEditorLeafContents()).toEqual(['https://user/1']);
    });

    it('should render as mention view elements when multiple mention strings are passed in the markdown string', async () => {
        element.setMarkdown('<user:1> <user:2>');
        await waitForUpdatesAsync();

        expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
            'P',
            RICH_TEXT_MENTION_USERS_VIEW_TAG,
            RICH_TEXT_MENTION_USERS_VIEW_TAG,
            'BR'
        ]);
        expect(
            pageObject.getEditorMentionViewAttributeValues('mention-label')
        ).toEqual(['John Doe', 'Mary Wilson']);
    });
});

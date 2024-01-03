import { html } from '@microsoft/fast-element';
import { richTextEditorTag, RichTextEditor } from '..';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { parameterizeNamedList } from '../../../utilities/tests/parameterized';
import { RichTextEditorPageObject } from '../testing/rich-text-editor.pageobject';
import { richTextMentionUsersTag } from '../../../rich-text-mention/users';
import { mappingUserTag } from '../../../mapping/user';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import { richTextMentionUsersViewTag } from '../../../rich-text-mention/users/view';
import {
    appendTestMentionConfiguration,
    replaceUserMappingElements,
    appendUserMentionConfiguration
} from '../testing/rich-text-editor-utils';
import { iconAtTag } from '../../../icons/at';
import { iconExclamationMarkTag } from '../../../icons/exclamation-mark';
import { ArrowKeyButton, ToolbarButton } from '../testing/types';
import { wackyStrings } from '../../../utilities/tests/wacky-strings';

const RICH_TEXT_MENTION_USERS_VIEW_TAG = richTextMentionUsersViewTag.toUpperCase();
const ICON_AT_TAG = iconAtTag.toUpperCase();
const ICON_EXCLAMATION_TAG = iconExclamationMarkTag.toUpperCase();

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
        it('should retain the checked state of the format buttons when configuration added dynamically', async () => {
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bold)
            ).toBeTrue();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.italics)
            ).toBeTrue();
            await appendUserMentionConfiguration(element);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bold)
            ).toBeTrue();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.italics)
            ).toBeTrue();
        });

        it('should retain the checked state of the format buttons when configuration updated', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'username1' }]
            );
            await pageObject.toggleFooterButton(ToolbarButton.bold);
            await pageObject.toggleFooterButton(ToolbarButton.italics);
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bold)
            ).toBeTrue();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.italics)
            ).toBeTrue();
            mappingElements[0]!.displayName = 'updated-name';
            await waitForUpdatesAsync();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.bold)
            ).toBeTrue();
            expect(
                pageObject.getButtonCheckedState(ToolbarButton.italics)
            ).toBeTrue();
        });

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

        it('should render as mention elements when two mentions without a space and configuration added dynamically', async () => {
            element.setMarkdown('<user:1><user:2>');

            expect(pageObject.getEditorTagNames()).toEqual(['P', 'A', 'A']);

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

        describe('user mention button', () => {
            it('should not have `at icon` button when no configuration element is given', () => {
                expect(pageObject.getMentionButtonIcon(0)).toBeUndefined();
            });

            it('should have empty button title and text content as default', async () => {
                await appendUserMentionConfiguration(element);

                expect(pageObject.getMentionButtonTitle(0)).toBe('');
                expect(pageObject.getMentionButtonLabel(0)).toBe('');
            });

            it('should have button title and text when `button-label` updated', async () => {
                const { userMentionElement } = await appendUserMentionConfiguration(element);
                userMentionElement.buttonLabel = 'at mention';
                await waitForUpdatesAsync();

                expect(pageObject.getMentionButtonTitle(0)).toBe('at mention');
                expect(pageObject.getMentionButtonLabel(0)).toBe('at mention');
            });
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

        it('user mention button should have `at icon` buttons when user configuration and test elements are given', async () => {
            await appendUserMentionConfiguration(element);
            await appendTestMentionConfiguration(element);

            expect(pageObject.getMentionButtonIcon(0)).toBe(ICON_AT_TAG);
            expect(pageObject.getMentionButtonIcon(1)).toBe(
                ICON_EXCLAMATION_TAG
            );
        });
    });

    it('should fire "mention-update" event from configuration element when there is @mention in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('@test');
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event from configuration element when there is update in @mention in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        await pageObject.setEditorTextContent('@test');
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('update');
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event from configuration element when pasting @ in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        pageObject.pasteToEditor('@test');
        await waitForUpdatesAsync();
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should fire "mention-update" event when deleting an existing @mention partially in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        await pageObject.setEditorTextContent('@test');
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.sliceEditorContent(2, 5);
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(1);
    });

    it('should not fire "mention-update" event when deleting an existing @mention completely in editor', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        await pageObject.setEditorTextContent('@test');
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.sliceEditorContent(0, 5);
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(0);
    });

    it('should not fire "mention-update" event when adding text near an existing @ mention', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element
        );
        element.setMarkdown('<user:1>');
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        await pageObject.setEditorTextContent('text');
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(0);
    });

    it('should not fire "mention-update" event when pasting a block of text that contains a @ mention in the middle', async () => {
        const { userMentionElement } = await appendUserMentionConfiguration(
            element,
            [{ key: 'user:1', displayName: 'username1' }]
        );
        const htmlContent = pageObject.getParsedHtmlFromMarkdown(
            'start <user:1> end',
            [{ key: 'user:1', displayName: 'username1' }]
        );
        const mentionUpdateSpy = jasmine.createSpy('mention-update');
        userMentionElement.addEventListener('mention-update', mentionUpdateSpy);
        pageObject.pasteHTMLToEditor(htmlContent);
        expect(mentionUpdateSpy).toHaveBeenCalledTimes(0);
    });

    it('should fire "mention-update" event with specific filter details from configuration element when there is @mention in editor', async () => {
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
                input: '<user:1>',
                content: 'User'
            },
            {
                name: 'Mention Node within strong node',
                input: '**<user:1>**',
                content: 'User'
            },
            {
                name: 'Mention Node within italics node',
                input: '*<user:1>*',
                content: 'User'
            },
            {
                name: 'Mention Node within strong and italics node',
                input: '***<user:1>***',
                content: 'User'
            }
        ] as const;

        parameterizeNamedList(validMentionNodes, (spec, name, value) => {
            spec(`${name} renders as plain text in editor`, async () => {
                await appendUserMentionConfiguration(element, [
                    { key: 'user:1', displayName: value.content }
                ]);
                const htmlContent = pageObject.getParsedHtmlFromMarkdown(
                    value.input,
                    [{ key: 'user:1', displayName: value.content }]
                );
                pageObject.pasteHTMLToEditor(htmlContent);
                expect(pageObject.getEditorTagNamesWithClosingTags()).toEqual([
                    'P',
                    '/P'
                ]);
                expect(pageObject.getEditorTextContents()).toEqual([
                    value.content
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

    describe('user mention button', () => {
        beforeEach(async () => {
            await waitForUpdatesAsync();
        });

        it('should get `@` text without a preceding whitespace at the start of a line, when button clicked', async () => {
            await pageObject.clickUserMentionButton();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(pageObject.getEditorFirstChildTextContent()).toBe('@');
        });

        it('should get `@` text with a single preceding whitespace after a word with space, when button clicked', async () => {
            await pageObject.setEditorTextContent('User ');
            await pageObject.clickUserMentionButton();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(pageObject.getEditorFirstChildTextContent()).toBe('User @');
        });

        it('should get `@` text with a single preceding whitespace after a word without space, when button clicked', async () => {
            await pageObject.setEditorTextContent('User');
            await pageObject.clickUserMentionButton();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(pageObject.getEditorFirstChildTextContent()).toBe('User @');
        });

        it('should get `@` text without a preceding whitespace after a hard break, when button clicked', async () => {
            await pageObject.setEditorTextContent('User');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.clickUserMentionButton();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                'BR',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(pageObject.getEditorFirstChildTextContent()).toBe('User@');
        });

        it('should get `@` text with a single preceding whitespace after a hard break with a text, when button clicked', async () => {
            await pageObject.setEditorTextContent('User');
            await pageObject.pressShiftEnterKeysInEditor();
            await pageObject.setEditorTextContent('Text');
            await pageObject.clickUserMentionButton();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                'BR',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(pageObject.getEditorFirstChildTextContent()).toBe(
                'UserText @'
            );
        });

        it('should open mention popup, when button clicked', async () => {
            await pageObject.clickUserMentionButton();

            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });
    });
});

describe('RichTextEditorMentionListbox', () => {
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

    describe('user mention via mention list box', () => {
        it('should display list of mention items in the mention popup with respect to mapping', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
        });

        describe('various wacky strings should display as it is in the mention popup option', () => {
            parameterizeNamedList(wackyStrings, (spec, name, value) => {
                spec(`for ${name}`, async () => {
                    await appendUserMentionConfiguration(element, [
                        { key: 'user:1', displayName: value.name }
                    ]);
                    await pageObject.setEditorTextContent('@');

                    expect(pageObject.getMentionListboxItemsName()).toEqual([
                        value.name
                    ]);
                });
            });
        });

        it('should get first option as selected', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');

            expect(pageObject.getSelectedOption()).toBe('username1');
        });

        it('should filter mention popup list based on the text after trigger character', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);

            await pageObject.setEditorTextContent('username2');

            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username2'
            ]);
            expect(pageObject.getSelectedOption()).toBe('username2');
        });

        it('should filter mention popup list when the entered text contains space', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'user1 name' },
                { key: 'user:2', displayName: 'user2 name' }
            ]);
            await pageObject.setEditorTextContent('@');
            await pageObject.setEditorTextContent('user2 n');

            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'user2 name'
            ]);
            expect(pageObject.getSelectedOption()).toBe('user2 name');
        });

        it('should commit mention into the editor when clicked', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            await pageObject.clickMentionListboxOption(0);

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1']);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should commit mention into the editor on Enter', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            await pageObject.pressEnterKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1']);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should commit mention into the editor on Tab', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            await pageObject.pressTabKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username1']);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should close the popup when clicking Escape', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            await pageObject.pressEscapeKeyInEditor();
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should filter and commit first mention into the editor on Enter', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@username2');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username2'
            ]);
            await pageObject.pressEnterKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username2']);
        });

        it('should filter and commit first mention into the editor on Tab', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@username2');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username2'
            ]);
            await pageObject.pressTabKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username2']);
        });

        it('should get second option as selected on arrow key down', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            await pageObject.pressArrowKeyInEditor(ArrowKeyButton.down);

            expect(pageObject.getSelectedOption()).toBe('username2');
        });

        it('should get first option as selected on arrow key down and up', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            await pageObject.pressArrowKeyInEditor(ArrowKeyButton.down);
            await pageObject.pressArrowKeyInEditor(ArrowKeyButton.up);

            expect(pageObject.getSelectedOption()).toBe('username1');
        });

        it('should commit second option on arrow key down and enter', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            await pageObject.pressArrowKeyInEditor(ArrowKeyButton.down);
            await pageObject.pressEnterKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username2']);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should commit second option on arrow key down and tab', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            await pageObject.pressArrowKeyInEditor(ArrowKeyButton.down);
            await pageObject.pressTabKeyInEditor();

            expect(pageObject.getMarkdownRenderedTagNames()).toEqual([
                'P',
                RICH_TEXT_MENTION_USERS_VIEW_TAG
            ]);
            expect(
                pageObject.getEditorMentionViewAttributeValues('mention-label')
            ).toEqual(['username2']);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('focus out from the editor should close the mention popup', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');

            expect(pageObject.isMentionListboxOpened()).toBeTrue();

            await pageObject.focusOutEditor();

            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('setting `disabled` should close the mention popup', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');

            expect(pageObject.isMentionListboxOpened()).toBeTrue();

            await pageObject.setDisabled(true);

            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });
    });

    describe('Dynamically update mention popup items based on configuration changes', () => {
        it('should close mention popup when removing configuration element', async () => {
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            element.removeChild(userMentionElement);
            await waitForUpdatesAsync();
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            expect(pageObject.getMentionListboxItemsName()).toEqual([]);
        });

        it('should update mention popup list when removing mapping element', async () => {
            const { mappingElements, userMentionElement } = await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            userMentionElement.removeChild(mappingElements[0]!);
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username2'
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });

        it('should update mention popup list when mapping elements get replaced', async () => {
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            await replaceUserMappingElements(userMentionElement, [
                { key: 'user:3', displayName: 'username3' },
                { key: 'user:4', displayName: 'username4' }
            ]);
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username3',
                'username4'
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });

        it('should close mention popup when updating to invalid `pattern`', async () => {
            const { userMentionElement } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            userMentionElement.pattern = 'invalid';
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should update mention popup list when updating `display-name`', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            mappingElements[0]!.displayName = 'updated-name';
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'updated-name',
                'username2'
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });

        it('should update mention popup list when updating valid `key`', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'invalid', displayName: 'username1' }]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            expect(pageObject.getMentionListboxItemsName()).toEqual([]);
            mappingElements[0]!.key = 'user:1';
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1'
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });

        it('should close mention popup when updating to invalid `key`', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('@');
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            mappingElements[0]!.key = 'invalid';
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([]);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });

        it('should retain mention popup list position in the same cursor position when configuration got updated', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [
                    { key: 'user:1', displayName: 'username1' },
                    { key: 'user:2', displayName: 'username2' }
                ]
            );
            await pageObject.setEditorTextContent('First Line');
            pageObject.moveCursorToStart();
            await pageObject.clickUserMentionButton();
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            mappingElements[0]!.displayName = 'New user';
            await waitForUpdatesAsync();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'New user',
                'username2'
            ]);
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
        });

        it('should show mention popup for multiple mention configuration elements', async () => {
            await appendUserMentionConfiguration(element, [
                { key: 'user:1', displayName: 'username1' },
                { key: 'user:2', displayName: 'username2' }
            ]);
            await pageObject.setEditorTextContent('@');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'username1',
                'username2'
            ]);
            await pageObject.clickMentionListboxOption(0);
            await appendTestMentionConfiguration(element, [
                { key: 'test:1', displayName: 'testname1' },
                { key: 'test:2', displayName: 'testname2' }
            ]);
            await pageObject.setEditorTextContent('!');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            expect(pageObject.getMentionListboxItemsName()).toEqual([
                'testname1',
                'testname2'
            ]);
        });

        it('mention listbox should be closed when cursor position is moved to start and configuration dynamically changes', async () => {
            const { mappingElements } = await appendUserMentionConfiguration(
                element,
                [{ key: 'user:1', displayName: 'user name1' }]
            );
            await pageObject.setEditorTextContent('@user');
            expect(pageObject.isMentionListboxOpened()).toBeTrue();
            await pageObject.setCursorPosition(1);
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
            mappingElements[0]!.displayName = 'user name2';
            await waitForUpdatesAsync();
            expect(pageObject.isMentionListboxOpened()).toBeFalse();
        });
    });
});

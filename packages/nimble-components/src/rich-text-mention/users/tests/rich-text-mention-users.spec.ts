import { html, repeat } from '@microsoft/fast-element';
import { RichTextMentionUsers, richTextMentionUsersTag } from '..';
import type { MappingUserKey } from '../../../mapping/base/types';
import { mappingUserTag } from '../../../mapping/user';
import { mappingTextTag } from '../../../mapping/text';
import { Fixture, fixture } from '../../../utilities/tests/fixture';
import { iconAtTag } from '../../../icons/at';
import { MappingUserConfig } from '../../base/models/mapping-user-config';

interface BasicUserMentionMapping {
    key?: MappingUserKey;
    displayName?: string;
}

describe('RichTextMentionUsers', () => {
    let element: RichTextMentionUsers;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    async function setup(
        mappings: BasicUserMentionMapping[],
        pattern = ''
    ): Promise<Fixture<RichTextMentionUsers>> {
        return fixture<RichTextMentionUsers>(html`
            <${richTextMentionUsersTag} pattern="${pattern}">
            ${repeat(
        () => mappings,
        html<BasicUserMentionMapping>`
                        <${mappingUserTag}
                            key="${x => x.key}"
                            display-name="${x => x.displayName}">
                        </${mappingUserTag}>
                    `
    )}
            </${richTextMentionUsersTag}>`);
    }

    afterEach(async () => {
        if (disconnect) {
            await disconnect();
        }
    });

    it('should export its tag', () => {
        expect(richTextMentionUsersTag).toBe('nimble-rich-text-mention-users');
    });

    it('can construct an element instance', () => {
        expect(
            document.createElement('nimble-rich-text-mention-users')
        ).toBeInstanceOf(RichTextMentionUsers);
    });

    it('should have character, icon and pattern in mention internals', async () => {
        ({ element, connect, disconnect } = await setup(
            [
                { key: 'user:1', displayName: 'user' },
                { key: 'user:2', displayName: 'user' }
            ],
            'user:'
        ));
        await connect();
        expect(element.mentionInternals.character).toBe('@');
        expect(element.mentionInternals.icon).toBe(iconAtTag);
        expect(element.mentionInternals.pattern).toBe('user:');
    });

    it('should have mappingConfigs based on mapping elements', async () => {
        ({ element, connect, disconnect } = await setup(
            [
                { key: 'user:1', displayName: 'user' },
                { key: 'user:2', displayName: 'user' }
            ],
            'user:'
        ));
        await connect();
        const mappingConfig = new Map([
            ['user:1', new MappingUserConfig('user:1', 'user')],
            ['user:2', new MappingUserConfig('user:2', 'user')]
        ]);
        expect(element.mentionInternals.mentionConfig?.mappingConfigs).toEqual(
            mappingConfig
        );
    });

    it('should have empty Map as mappingConfigs when there is no mappings', async () => {
        ({ element, connect, disconnect } = await setup([]));
        await connect();
        const mappingConfig = new Map([]);
        expect(element.mentionInternals.mentionConfig?.mappingConfigs).toEqual(
            mappingConfig
        );
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ element, connect, disconnect } = await setup([]));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedMappingType).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeFalse();
            expect(element.validity.unsupportedMentionHrefValue).toBeFalse();
        });

        it('is valid with valid unique string key values', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' },
                    { key: 'user:3', displayName: 'user' },
                    { key: 'user:4', displayName: 'user' },
                    { key: 'user:5', displayName: 'user' }
                ],
                ''
            ));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedMappingType).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeFalse();
            expect(element.validity.unsupportedMentionHrefValue).toBeFalse();
            expect(element.validity.missingDisplayNameValue).toBeFalse();
        });

        it('is invalid with missing key', async () => {
            ({ element, connect, disconnect } = await setup([
                { displayName: 'user' },
                { key: 'user:1', displayName: 'user' }
            ]));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with missing displayName', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'user:2' },
                { key: 'user:1', displayName: 'user' }
            ]));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.missingDisplayNameValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with duplicate key values', async () => {
            ({ element, connect, disconnect } = await setup([
                { key: 'user:1', displayName: 'user' },
                { key: 'user:1', displayName: 'user' }
            ]));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with mismatch pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                'invalidPattern'
            ));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.unsupportedMentionHrefValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is valid with valid pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                'user:.*'
            ));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedMentionHrefValue).toBeFalse();
        });

        it('is invalid with invalid regex pattern', async () => {
            ({ element, connect, disconnect } = await setup(
                [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                '(invalid'
            ));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.unsupportedPatternValue).toBeTrue();
            expect(element.validity.unsupportedMentionHrefValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        async function setupInvalidMappings(): Promise<
        Fixture<RichTextMentionUsers>
        > {
            return fixture<RichTextMentionUsers>(html`
                <${richTextMentionUsersTag} pattern="">
                    <${mappingUserTag} key="foo" label="foo"></${mappingUserTag}>
                    <${mappingTextTag} key="foo" label="foo"></${mappingTextTag}>
                </${richTextMentionUsersTag}>`);
        }

        it('is invalid with text mapping', async () => {
            ({ element, connect, disconnect } = await setupInvalidMappings());
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.unsupportedMappingType).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        async function setupMissingPattern(): Promise<
        Fixture<RichTextMentionUsers>
        > {
            return fixture<RichTextMentionUsers>(html`
                <${richTextMentionUsersTag}>
                    <${mappingUserTag} key="foo" display-name="foo"></${mappingUserTag}>
                </${richTextMentionUsersTag}>`);
        }

        it('is invalid with missing pattern attribute', async () => {
            ({ element, connect, disconnect } = await setupMissingPattern());
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.missingPatternAttribute).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });
    });
});

import { html, repeat } from '@microsoft/fast-element';
import { RichTextMentionUsers, richTextMentionUsersTag } from '..';
import type { MappingUserKey } from '../../../mapping/base/types';
import { MappingUser, mappingUserTag } from '../../../mapping/user';
import { mappingTextTag } from '../../../mapping/text';
import { Fixture, fixture } from '../../../utilities/tests/fixture';
import { iconAtTag } from '../../../icons/at';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';

interface BasicUserMentionMapping {
    key?: MappingUserKey;
    displayName?: string;
}

async function setUserMappingElements(
    element: RichTextMentionUsers,
    mappings: BasicUserMentionMapping[]
): Promise<void> {
    const newUserMappingElements: MappingUser[] = [];
    mappings.forEach(mapping => {
        const mappingUser = document.createElement(
            mappingUserTag
        ) as MappingUser;
        mappingUser.key = mapping.key ?? '';
        mappingUser.displayName = mapping.displayName ?? '';
        newUserMappingElements.push(mappingUser);
    });
    element.replaceChildren(...newUserMappingElements);
    await waitForUpdatesAsync();
}

async function updateFirstUserMappingElement(
    element: RichTextMentionUsers,
    mapping: BasicUserMentionMapping
): Promise<void> {
    if (element.hasChildNodes()) {
        element.firstElementChild?.setAttribute('key', mapping.key!);
        element.firstElementChild?.setAttribute('display-name', mapping.displayName!);
    }
    await waitForUpdatesAsync();
}

async function updatePatternAttribute(
    element: RichTextMentionUsers,
    pattern: string
): Promise<void> {
    element.setAttribute('pattern', pattern);
    await waitForUpdatesAsync();
}

describe('RichTextMentionUsers', () => {
    let element: RichTextMentionUsers;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    // prettier-ignore
    async function setup(options: {
        mappings: BasicUserMentionMapping[],
        pattern: string
    }): Promise<Fixture<RichTextMentionUsers>> {
        return fixture<RichTextMentionUsers>(html`
            <${richTextMentionUsersTag} pattern="${options.pattern}">
                ${repeat(() => options.mappings, html<BasicUserMentionMapping>`
                    <${mappingUserTag}
                        key="${x => x.key}"
                        display-name="${x => x.displayName}">
                    </${mappingUserTag}>
                `)}
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
        ({ element, connect, disconnect } = await setup({
            mappings: [
                { key: 'user:1', displayName: 'user' },
                { key: 'user:2', displayName: 'user' }
            ],
            pattern: 'user:'
        }));
        await connect();
        expect(element.mentionInternals.character).toBe('@');
        expect(element.mentionInternals.icon).toBe(iconAtTag);
        expect(element.mentionInternals.pattern).toBe('user:');
    });

    it('should have mappingConfigs based on mapping elements', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [
                { key: 'user:1', displayName: 'user' },
                { key: 'user:2', displayName: 'user' }
            ],
            pattern: 'user:'
        }));
        await connect();
        const mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(2);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1', 'user:2']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:2')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');
        expect(mappingConfigs.get('user:2')?.mentionHref).toEqual('user:2');
    });

    it('should update mappingConfigs when mapping elements changed', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [{ key: 'user:1', displayName: 'user' }],
            pattern: 'user:'
        }));
        await connect();
        let mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');

        const newMappingData = [{ key: 'user:3', displayName: 'user-3' }];
        await setUserMappingElements(element, newMappingData);
        mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:3']);
        expect(mappingConfigs.get('user:3')?.displayName).toEqual('user-3');
        expect(mappingConfigs.get('user:3')?.mentionHref).toEqual('user:3');
    });

    it('should update mappingConfigs when its mapping element modified with valid data', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [{ key: 'user:1', displayName: 'user' }],
            pattern: 'user:'
        }));
        await connect();
        let mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');

        const newMappingData = { key: 'user:3', displayName: 'user-3' };
        await updateFirstUserMappingElement(element, newMappingData);
        mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:3']);
        expect(mappingConfigs.get('user:3')?.displayName).toEqual('user-3');
        expect(mappingConfigs.get('user:3')?.mentionHref).toEqual('user:3');
    });

    it('should have undefined mentionConfig when its mapping element modified with invalid data', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [{ key: 'user:1', displayName: 'user' }],
            pattern: 'user:'
        }));
        await connect();
        const mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');

        const newMappingData = { key: '', displayName: 'user-3' };
        await updateFirstUserMappingElement(element, newMappingData);
        expect(element.mentionInternals.mentionConfig).toEqual(undefined);
    });

    it('should have empty Map as mappingConfigs when there is no mappings', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [],
            pattern: ''
        }));
        await connect();
        const mappingConfig = new Map([]);
        expect(element.mentionInternals.mentionConfig?.mappingConfigs).toEqual(
            mappingConfig
        );
    });

    it('should have undefined mentionConfig when an invalid pattern is assigned', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [{ key: 'user:1', displayName: 'user' }],
            pattern: 'user:.*'
        }));
        await connect();
        const mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');
        await updatePatternAttribute(element, 'invalid_pattern');
        expect(element.mentionInternals.mentionConfig).toEqual(undefined);
    });

    it('should have undefined mentionConfig when mapping elements with mismatch key (href) changed', async () => {
        ({ element, connect, disconnect } = await setup({
            mappings: [{ key: 'user:1', displayName: 'user' }],
            pattern: 'user:'
        }));
        await connect();
        const mappingConfigs = element.mentionInternals.mentionConfig!.mappingConfigs;
        expect(mappingConfigs?.size).toEqual(1);
        expect(Array.from(mappingConfigs.keys())).toEqual(['user:1']);
        expect(mappingConfigs.get('user:1')?.displayName).toEqual('user');
        expect(mappingConfigs.get('user:1')?.mentionHref).toEqual('user:1');
        const newMappingData = [
            { key: 'invalid_userkey', displayName: 'user' },
            { key: 'user:4', displayName: 'user' }
        ];
        await setUserMappingElements(element, newMappingData);
        expect(element.mentionInternals.mentionConfig).toEqual(undefined);
    });

    describe('validation', () => {
        it('is valid with no mappings', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [],
                pattern: ''
            }));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedMappingType).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeFalse();
            expect(element.validity.mentionHrefNotValidUrl).toBeFalse();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeFalse();
        });

        it('is valid with valid unique string key values', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' },
                    { key: 'user:3', displayName: 'user' },
                    { key: 'user:4', displayName: 'user' },
                    { key: 'user:5', displayName: 'user' }
                ],
                pattern: 'user:'
            }));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedMappingType).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeFalse();
            expect(element.validity.mentionHrefNotValidUrl).toBeFalse();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeFalse();
            expect(element.validity.missingDisplayNameValue).toBeFalse();
        });

        it('is invalid with missing key', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { displayName: 'user' },
                    { key: 'user:1', displayName: 'user' }
                ],
                pattern: 'user'
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.missingMentionHrefValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with missing displayName', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:2' },
                    { key: 'user:1', displayName: 'user' }
                ],
                pattern: 'user'
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.missingDisplayNameValue).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with duplicate key values', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:1', displayName: 'user' }
                ],
                pattern: ''
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.duplicateMappingMentionHref).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with mismatching key', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'invalid:userkey', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: 'user:'
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is invalid with invalid url key', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: '', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: 'user:'
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.mentionHrefNotValidUrl).toBeTrue();
            expect(element.mentionInternals.mentionConfig).toBe(undefined);
        });

        it('is valid with valid pattern', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: 'user:.*'
            }));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.mentionHrefNotValidUrl).toBeFalse();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeFalse();
        });

        it('is invalid with invalid regex pattern', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: '(invalid'
            }));
            await connect();
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.unsupportedPatternValue).toBeTrue();
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

        it('is valid when valid pattern is assigned', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: 'user:.*'
            }));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeFalse();
            expect(element.validity.unsupportedPatternValue).toBeFalse();
            await updatePatternAttribute(element, 'user:');
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.mentionHrefDoesNotMatchPattern).toBeFalse();
            expect(element.validity.unsupportedPatternValue).toBeFalse();
        });

        it('is invalid when invalid pattern is assigned', async () => {
            ({ element, connect, disconnect } = await setup({
                mappings: [
                    { key: 'user:1', displayName: 'user' },
                    { key: 'user:2', displayName: 'user' }
                ],
                pattern: 'user:.*'
            }));
            await connect();
            expect(element.checkValidity()).toBeTrue();
            expect(element.validity.unsupportedPatternValue).toBeFalse();
            await updatePatternAttribute(element, '(pattern');
            expect(element.checkValidity()).toBeFalse();
            expect(element.validity.unsupportedPatternValue).toBeTrue();
        });
    });
});

import { html, observable, slotted, attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import type { Mapping } from '../../../mapping/base';
import type { RichTextEditor } from '..';
import { RichTextMarkdownSerializer } from '../../models/markdown-serializer';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-rich-text-mention-users': RichTextEnumMention;
    }
}

// type MappingKey = string | number | boolean;

export interface UserInfo {
    url: string;
    value: string;
}

// type MappingConfigs = Map<MappingKey, MappingConfig>;

// interface RichTextEnumMentionConfig {
//     mappingConfigs: MappingConfigs;
// }

/**
 * Table column that maps values to strings
 */
export class RichTextEnumMention extends FoundationElement {
    /** @internal */
    @observable
    public mappings: Mapping[] = [];

    @attr
    public pattern!: string;

    public userInternals!: UserInfo[];

    public getMentionedUsers(): string[] {
        const editor = this.parentElement as RichTextEditor;
        const mentionedUsers = RichTextMarkdownSerializer.getMentionedUser(editor.tiptapEditor.state.doc);
        // eslint-disable-next-line no-console
        console.log(mentionedUsers);
        return mentionedUsers;
    }

    // public createColumnConfig(mappingConfigs: MappingConfigs): RichTextEnumMentionConfig {
    //     return {
    //         mappingConfigs
    //     };
    // }

    // public createMappingConfig(mapping: Mapping): MappingConfig {
    //     if (mapping instanceof MappingMention) {
    //         return new MappingConfig(mapping.text);
    //     }
    //     // Getting here would indicate a programming error, b/c validation will prevent
    //     // this function from running when there is an unsupported mapping.
    //     throw new Error('Unsupported mapping');
    // }

    private updateColumnConfig(): void {
        this.userInternals = this.getMappingConfigs();
    }

    private getMappingConfigs(): UserInfo[] {
        // const mappingConfigs = new Map<MappingKey, MappingConfig>();
        const mappingConfigs: UserInfo[] = [];
        this.mappings.forEach(mapping => {
            // const mappingConfig = this.createMappingConfig(mapping);
            // mappingConfigs.set(mapping.key!, mappingConfig);
            mappingConfigs.push({ url: mapping.key! as string, value: mapping.text! });
        });
        return mappingConfigs;
    }

    private mappingsChanged(): void {
        this.updateColumnConfig();
    }
}

const richTextEnumMention = RichTextEnumMention.compose({
    baseName: 'rich-text-mention-users',
    template: html`<slot ${slotted('mappings')} name="mapping"></slot>`,
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(richTextEnumMention());
export const richTextEnumMentionTextTag = DesignSystem.tagFor(RichTextEnumMention);

import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber,
    ViewTemplate
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingConfig } from './models/mapping-config';
import { MappingMentionBase } from '../../mapping/mention-base';
import type {
    RichTextMentionValidator,
    RichTextMentionValidity
} from './models/rich-text-mention-base-validator';
import type { ListOption } from '../../list-option';
import {
    MentionInternals,
    MentionInternalsOptions
} from './models/mention-internals';

export type MappingConfigs = ReadonlyMap<string, MappingConfig>;

export interface RichTextMentionConfig {
    mappingConfigs: MappingConfigs;
}

/**
 * The base class for Mention mapping configuration
 */
export abstract class RichTextMention<
    TMentionConfig extends RichTextMentionConfig,
    TValidator extends RichTextMentionValidator<[]>
>
    extends FoundationElement
    implements Subscriber {
    public readonly mentionInternals: MentionInternals<TMentionConfig> = new MentionInternals(this.getMentionInternalsOptions());

    @attr
    public pattern?: string;

    /** @internal */
    public validator = this.createValidator();

    /** @internal */
    public mappingNotifiers: Notifier[] = [];

    /** @internal */
    @observable
    public mappings: MappingMentionBase[] = [];

    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    public get validity(): RichTextMentionValidity {
        return this.validator.getValidity();
    }

    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MappingMentionBase && typeof args === 'string') {
            this.updateMentionConfig();
        }
    }

    /**
     * Get the list of view item need to be populated in the mention popup
     */
    public getListOptions(): ViewTemplate<ListOption>[] {
        const mappingConfigs = this.mentionInternals.mentionConfig?.mappingConfigs?.values();
        const listOptions = [];
        if (mappingConfigs === undefined) {
            return [];
        }
        for (const value of mappingConfigs) {
            listOptions.push(value.listView);
        }
        return listOptions;
    }

    public abstract createValidator(): TValidator;

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;

    protected abstract createMentionConfig(
        mappingConfigs: MappingConfigs
    ): TMentionConfig;

    protected abstract createMappingConfig(
        mapping: MappingMentionBase
    ): MappingConfig;

    private getMappingConfigs(): MappingConfigs {
        const mappingConfigs = new Map<string, MappingConfig>();
        this.mappings.forEach(mapping => {
            const href = mapping.mentionHref ?? undefined;
            if (href === undefined) {
                throw Error(
                    'mentionHref was invalid for type. Validation should have prevented this.'
                );
            }
            const mappingConfig = this.createMappingConfig(mapping);
            mappingConfigs.set(href, mappingConfig);
        });
        return mappingConfigs;
    }

    private updateMentionConfig(): void {
        this.validator.validate(this.mappings, this.pattern);
        this.mentionInternals.mentionConfig = this.validator.isValid()
            ? this.createMentionConfig(this.getMappingConfigs())
            : undefined;
    }

    private mappingsChanged(): void {
        this.updateMentionConfig();
        this.observeMappings();
    }

    private removeMappingObservers(): void {
        this.mappingNotifiers.forEach(notifier => {
            notifier.unsubscribe(this);
        });
        this.mappingNotifiers = [];
    }

    private observeMappings(): void {
        this.removeMappingObservers();

        for (const mapping of this.mappings) {
            const notifier = Observable.getNotifier(mapping);
            notifier.subscribe(this);
            this.mappingNotifiers.push(notifier);
        }
    }
}

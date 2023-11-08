import {
    attr,
    Notifier,
    Observable,
    observable,
    Subscriber
} from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { MappingConfig } from './models/mapping-config';
import type {
    RichTextMentionValidator,
    RichTextMentionValidity
} from './models/mention-validator';
import {
    MentionInternals,
    MentionInternalsOptions
} from './models/mention-internals';
import { Mapping } from '../../mapping/base';

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
    public mappings: Mapping<unknown>[] = [];

    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    public get validity(): RichTextMentionValidity {
        return this.validator.getValidity();
    }

    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof Mapping && typeof args === 'string') {
            this.updateMentionConfig();
        }
    }

    public abstract createValidator(): TValidator;

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;

    protected abstract createMentionConfig(
        mappingConfigs: MappingConfigs
    ): TMentionConfig;

    protected abstract createMappingConfig(
        mapping: Mapping<unknown>
    ): MappingConfig;

    private getMappingConfigs(): MappingConfigs {
        const mappingConfigs = new Map<string, MappingConfig>();
        this.mappings.forEach(mapping => {
            const href = mapping.key ?? undefined;
            if (href === undefined || typeof href !== 'string') {
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

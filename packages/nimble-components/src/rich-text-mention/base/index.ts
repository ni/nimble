import { attr, Notifier, Observable, observable, Subscriber, ViewTemplate } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import { MentionInternals, MentionInternalsOptions } from './models/mention-internals';
import type { MappingConfig } from './models/mapping-config';
import { MappingMentionBase } from '../../mapping/mention base';
import type { RichTextMentionBaseValidator } from './models/rich-text-mention-base-validator';
import type { RichTextMentionValidity } from './models/mention-validator';
import type { ListOption } from '../../list-option';

export type MappingConfigs = Map<string, MappingConfig>;

export interface RichTextMentionConfig {
    mappingConfigs: MappingConfigs;
}

/**
 * The base class for editor mention
 */
export abstract class RichTextMention<T extends RichTextMentionConfig, TValidator extends RichTextMentionBaseValidator<[]>> extends FoundationElement implements Subscriber {
    public readonly mentionInternals: MentionInternals<T> = new MentionInternals(this.getMentionInternalsOptions());

    /** @internal */
    public validator = this.createValidator();

    /** @internal */
    public mappingNotifiers: Notifier[] = [];

    @attr
    public pattern!: string;

    /** @internal */
    @observable
    public mappings: MappingMentionBase[] = [];

    public handleChange(source: unknown, args: unknown): void {
        if (source instanceof MappingMentionBase && typeof args === 'string') {
            this.updateMentionConfig();
        }
    }

    public checkValidity(): boolean {
        return this.mentionInternals.validConfiguration;
    }

    public get validity(): RichTextMentionValidity {
        return {};
    }

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

    protected abstract createMentionConfig(
        mappingConfigs: MappingConfigs
    ): T;

    protected abstract getMentionInternalsOptions(): MentionInternalsOptions;

    protected abstract createMappingConfig(mapping: MappingMentionBase): MappingConfig;

    private getMappingConfigs(): MappingConfigs {
        const mappingConfigs = new Map<string, MappingConfig>();
        this.mappings.forEach(mapping => {
            const url = mapping.mentionUrl ?? undefined;
            if (url === undefined) {
                throw Error(
                    'mentionUrl was invalid for type. Validation should have prevented this.'
                );
            }
            const mappingConfig = this.createMappingConfig(mapping);
            mappingConfigs.set(url, mappingConfig);
        });
        return mappingConfigs;
    }

    private updateMentionConfig(): void {
        this.validator.validate(this.mappings, this.pattern);
        this.mentionInternals.mentionConfig = this.validator.isValid() ? this.createMentionConfig(this.getMappingConfigs()) : undefined;
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
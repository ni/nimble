import { observable, ViewTemplate } from '@microsoft/fast-element';
import type { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { mentionPluginPrefix } from '../editor/types';
import type {
    MappingConfigs,
    MentionUpdateEmitter
} from '../../rich-text-mention/base/types';

/**
 * A configuration object for a Mention extension, to be used by the editor for loading mention plugins in tiptap.
 * This object maintains the necessary internal values for loading mention extension.
 */
export class MentionExtensionConfiguration {
    private static instance = 0;
    public readonly iconTemplate: ViewTemplate;
    public readonly viewElement: string;
    public readonly character: string;
    public readonly name: string;
    public readonly key: string;
    public readonly mappingConfigs?: MappingConfigs;
    public readonly mentionUpdateEmitter: MentionUpdateEmitter;

    @observable
    private _label = '';

    @observable
    public get label(): string {
        return this._label;
    }

    public set label(value: string) {
        this._label = value;
    }

    public constructor(mentionInternals: MentionInternals) {
        MentionExtensionConfiguration.instance += 1;
        const key = `${mentionPluginPrefix}${MentionExtensionConfiguration.instance}`;
        this.name = key;
        this.key = key;

        this.viewElement = mentionInternals.viewElement;
        this.character = mentionInternals.character;
        this.mappingConfigs = mentionInternals.mappingConfigs;
        this.iconTemplate = mentionInternals.iconTemplate;
        this.label = mentionInternals.buttonLabel ?? '';
        this.mentionUpdateEmitter = mentionInternals.mentionUpdateEmitter;
    }

    public static isObservedMentionInternalsProperty(arg: unknown): boolean {
        return (
            typeof arg === 'string'
            && ['buttonLabel'].includes(arg)
        );
    }
}

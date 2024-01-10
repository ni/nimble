import { DOM } from '@microsoft/fast-element';
import type { MentionInternals } from '../../rich-text-mention/base/models/mention-internals';
import { UpdateTracker } from '../../utilities/models/update-tracker';
import type { RichText } from '../base';

const isMentionInternalsProperty = (
    changedProperty: string,
    ...args: (keyof MentionInternals)[]
): boolean => {
    for (const arg of args) {
        if (changedProperty === arg) {
            return true;
        }
    }
    return false;
};

const trackedItems = ['pattern', 'mappingConfigs', 'buttonLabel'] as const;

/**
 * Helper class to track what updates are needed to the rich text components based on configuration
 * changes.
 */
export class RichTextUpdateTracker extends UpdateTracker<typeof trackedItems> {
    private updateQueued = false;

    public constructor(private readonly richText: RichText) {
        super(trackedItems);
    }

    public get updatePattern(): boolean {
        return this.isTracked('pattern');
    }

    public get updateMappingConfigs(): boolean {
        return this.isTracked('mappingConfigs');
    }

    public get updateButtonLabel(): boolean {
        return this.isTracked('buttonLabel');
    }

    public trackMentionInternalsPropertyChanged(
        changedMentionInternalsProperty: string
    ): void {
        if (
            isMentionInternalsProperty(
                changedMentionInternalsProperty,
                'mappingConfigs'
            )
        ) {
            this.track('mappingConfigs');
        } else if (
            isMentionInternalsProperty(
                changedMentionInternalsProperty,
                'pattern'
            )
        ) {
            this.track('pattern');
        } else if (
            isMentionInternalsProperty(
                changedMentionInternalsProperty,
                'buttonLabel'
            )
        ) {
            this.track('buttonLabel');
        }
        this.queueUpdate();
    }

    public trackMentionElementsInstancesChanged(): void {
        this.track('pattern');
        this.track('mappingConfigs');
        this.track('buttonLabel');
        this.queueUpdate();
    }

    protected override queueUpdate(): void {
        if (!this.richText.$fastController.isConnected) {
            return;
        }

        if (!this.updateQueued) {
            this.updateQueued = true;
            DOM.queueUpdate(() => {
                this.richText.createConfig();
                this.untrackAll();
                this.updateQueued = false;
            });
        }
    }
}

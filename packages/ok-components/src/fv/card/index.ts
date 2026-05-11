import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    FvCardAppearance,
    type FvCardAppearance as FvCardAppearanceType,
    FvCardInteractionMode,
    type FvCardInteractionMode as FvCardInteractionModeType
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-card': FvCard;
    }
}

function slotHasAssignedElements(slot: HTMLSlotElement): boolean {
    return slot.assignedElements({ flatten: true }).length > 0;
}

/**
 * An opinionated card component for FV layouts with optional media,
 * badges, footer metadata, and action content.
 */
export class FvCard extends FoundationElement {
    @attr({ attribute: 'card-title' })
    public override title = '';

    @attr
    public subtitle = '';

    @attr
    public description = '';

    @attr
    public appearance: FvCardAppearanceType = FvCardAppearance.outline;

    @attr({ attribute: 'interaction-mode' })
    public interactionMode: FvCardInteractionModeType = FvCardInteractionMode.static;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr
    public initials = '';

    /** @internal */
    @observable
    public hasIconContent = false;

    /** @internal */
    @observable
    public hasBadgesContent = false;

    /** @internal */
    @observable
    public hasDefaultContent = false;

    /** @internal */
    @observable
    public hasActionsContent = false;

    /** @internal */
    @observable
    public hasFooterStartContent = false;

    /** @internal */
    @observable
    public hasFooterEndContent = false;

    /** @internal */
    public get showInitials(): boolean {
        return !this.hasIconContent && this.initialsText.length > 0;
    }

    /** @internal */
    public get hasMedia(): boolean {
        return this.hasIconContent || this.showInitials;
    }

    /** @internal */
    public get initialsText(): string {
        return this.initials.trim().slice(0, 2).toUpperCase();
    }

    /** @internal */
    public get showBody(): boolean {
        return this.description.length > 0 || this.hasDefaultContent;
    }

    /** @internal */
    public get showFooter(): boolean {
        return this.hasFooterStartContent || this.hasFooterEndContent;
    }

    /** @internal */
    public get showActions(): boolean {
        return this.interactionMode === FvCardInteractionMode.static && this.hasActionsContent;
    }

    /** @internal */
    public get isCardInteractive(): boolean {
        return this.interactionMode === FvCardInteractionMode.card;
    }

    /** @internal */
    public handleIconSlotChange(event: Event): boolean {
        this.hasIconContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    /** @internal */
    public handleBadgesSlotChange(event: Event): boolean {
        this.hasBadgesContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    /** @internal */
    public handleDefaultSlotChange(event: Event): boolean {
        this.hasDefaultContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    /** @internal */
    public handleActionsSlotChange(event: Event): boolean {
        this.hasActionsContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    /** @internal */
    public handleFooterStartSlotChange(event: Event): boolean {
        this.hasFooterStartContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    /** @internal */
    public handleFooterEndSlotChange(event: Event): boolean {
        this.hasFooterEndContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }
}

const okFvCard = FvCard.compose({
    baseName: 'fv-card',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('ok')
    .register(okFvCard());
export const fvCardTag = 'ok-fv-card';

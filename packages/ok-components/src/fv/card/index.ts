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

    @observable
    public hasIconContent = false;

    @observable
    public hasBadgesContent = false;

    @observable
    public hasDefaultContent = false;

    @observable
    public hasActionsContent = false;

    @observable
    public hasFooterStartContent = false;

    @observable
    public hasFooterEndContent = false;

    public get showInitials(): boolean {
        return !this.hasIconContent && this.initialsText.length > 0;
    }

    public get hasMedia(): boolean {
        return this.hasIconContent || this.showInitials;
    }

    public get initialsText(): string {
        return this.initials.trim().slice(0, 2).toUpperCase();
    }

    public get showBody(): boolean {
        return this.description.length > 0 || this.hasDefaultContent;
    }

    public get showFooter(): boolean {
        return this.hasFooterStartContent || this.hasFooterEndContent;
    }

    public get showActions(): boolean {
        return this.interactionMode === FvCardInteractionMode.static && this.hasActionsContent;
    }

    public get isCardInteractive(): boolean {
        return this.interactionMode === FvCardInteractionMode.card;
    }

    public handleIconSlotChange(event: Event): boolean {
        this.hasIconContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    public handleBadgesSlotChange(event: Event): boolean {
        this.hasBadgesContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    public handleDefaultSlotChange(event: Event): boolean {
        this.hasDefaultContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    public handleActionsSlotChange(event: Event): boolean {
        this.hasActionsContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

    public handleFooterStartSlotChange(event: Event): boolean {
        this.hasFooterStartContent = slotHasAssignedElements(event.target as HTMLSlotElement);
        return true;
    }

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

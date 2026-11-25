import { attr, observable } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import {
    FvDashboardCardCorners,
    FvDashboardCardLayout,
    FvDashboardCardSeverity
} from './types';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-dashboard-card': FvDashboardCard;
    }
}

function slotHasAssignedElements(slot: HTMLSlotElement): boolean {
    return slot.assignedElements({ flatten: true }).length > 0;
}

/**
 * A dashboard card with standard and hero layouts, status styling, and composable content slots.
 * @slot icon - Icon aligned with the title and colored by severity.
 * @slot context - Optional category label above the title.
 * @slot title - Primary heading or value.
 * @slot subtitle - Supporting message directly below the title.
 * @slot status - Status indicators beside the title.
 * @slot actions - Interactive controls beside the title.
 * @slot - Primary content.
 * @slot supporting - Supporting metadata below the content.
 * @slot footer - Footer content.
 */
export class FvDashboardCard extends FoundationElement {
    @attr
    public layout: FvDashboardCardLayout = FvDashboardCardLayout.standard;

    @attr
    public corners: FvDashboardCardCorners = FvDashboardCardCorners.rounded;

    @attr
    public severity: FvDashboardCardSeverity = FvDashboardCardSeverity.none;

    /** @internal */
    @observable
    public hasIconContent = false;

    /** @internal */
    @observable
    public hasActionsContent = false;

    /** @internal */
    @observable
    public hasContextContent = false;

    /** @internal */
    @observable
    public hasTitleContent = false;

    /** @internal */
    @observable
    public hasSubtitleContent = false;

    /** @internal */
    @observable
    public hasStatusContent = false;

    /** @internal */
    @observable
    public hasDefaultContent = false;

    /** @internal */
    @observable
    public hasSupportingContent = false;

    /** @internal */
    @observable
    public hasFooterContent = false;

    /** @internal */
    public get hasHeaderContent(): boolean {
        return this.hasContextContent || this.hasTitleContent || this.hasSubtitleContent
            || this.hasStatusContent || this.hasActionsContent;
    }

    /** @internal */
    public handleSlotChange(event: Event): boolean {
        const slot = event.target as HTMLSlotElement;
        const hasContent = slotHasAssignedElements(slot);

        switch (slot.name) {
            case 'icon':
                this.hasIconContent = hasContent;
                break;
            case 'actions':
                this.hasActionsContent = hasContent;
                break;
            case 'context':
                this.hasContextContent = hasContent;
                break;
            case 'title':
                this.hasTitleContent = hasContent;
                break;
            case 'subtitle':
                this.hasSubtitleContent = hasContent;
                break;
            case 'status':
                this.hasStatusContent = hasContent;
                break;
            case 'supporting':
                this.hasSupportingContent = hasContent;
                break;
            case 'footer':
                this.hasFooterContent = hasContent;
                break;
            default:
                this.hasDefaultContent = hasContent;
                break;
        }

        return true;
    }
}

const okFvDashboardCard = FvDashboardCard.compose({
    baseName: 'fv-dashboard-card',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvDashboardCard());
export const fvDashboardCardTag = 'ok-fv-dashboard-card';

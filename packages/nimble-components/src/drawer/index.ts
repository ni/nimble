import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Dialog as FoundationDialog,
    dialogTemplate as template
} from '@microsoft/fast-foundation';
import {
    slideAnimationKeyframes,
    slideAnimationOptions,
    slideAnimationId
} from './animations';
import { styles } from './styles';
import { DrawerLocation, DrawerState } from './types';

/**
 * Drawer/Sidenav control. Shows content in a panel on the left / right side of the screen,
 * which animates to be visible with a slide-in / slide-out animation.
 * Configured via 'location', 'state', 'modal', 'preventDismiss' properties.
 */
export class Drawer extends FoundationDialog {
    @attr
    public location: DrawerLocation = DrawerLocation.Left;

    @attr
    public state: DrawerState = DrawerState.Closed;

    /**
     * True to prevent dismissing the drawer when the overlay outside the drawer is clicked.
     * Only applicable when 'modal' is set to true (i.e. when the overlay is used).
     * HTML Attribute: prevent-dismiss
     */
    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    public connectedCallback(): void {
        if (!this.hasAttribute('modal')) {
            this.modal = false;
        }
        this.trapFocus = false;
        super.connectedCallback();
        this.stateChanged();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.cancelCurrentAnimation();
    }

    public override show(): void {
        this.state = DrawerState.Opening;
    }

    public override hide(): void {
        this.state = DrawerState.Closing;
    }

    public override dismiss(): void {
        if (!this.preventDismiss) {
            super.dismiss();
            this.hide();
        }
    }

    private hiddenChanged(): void {
        if (this.hidden && this.state !== DrawerState.Closed) {
            this.state = DrawerState.Closed;
        } else if (!this.hidden && this.state === DrawerState.Closed) {
            this.state = DrawerState.Opened;
        }
    }

    private stateChanged(): void {
        if (this.isConnected) {
            this.cancelCurrentAnimation();
            switch (this.state) {
                case DrawerState.Opening:
                    this.animateOpening();
                    this.hidden = false;
                    break;
                case DrawerState.Opened:
                    this.hidden = false;
                    break;
                case DrawerState.Closing:
                    this.hidden = false;
                    this.animateClosing();
                    break;
                case DrawerState.Closed:
                    this.hidden = true;
                    break;
                default:
                    throw new Error(
                        'Unsupported state value. Expected: opening/opened/closing/closed'
                    );
            }
        }
    }

    private animateOpening(): void {
        const keyframes = this.location === DrawerLocation.Right
            ? slideAnimationKeyframes.rightSide
            : slideAnimationKeyframes.leftSide;
        this.animateDialog(keyframes, slideAnimationOptions.slideIn, () => {
            this.state = DrawerState.Opened;
        });
    }

    private animateClosing(): void {
        if (!this.hidden) {
            const keyframes = this.location === DrawerLocation.Right
                ? slideAnimationKeyframes.rightSide
                : slideAnimationKeyframes.leftSide;
            this.animateDialog(
                keyframes,
                slideAnimationOptions.slideOut,
                () => {
                    this.state = DrawerState.Closed;
                }
            );
        } else {
            this.state = DrawerState.Closed;
        }
    }

    private animateDialog(
        keyframes: PropertyIndexedKeyframes,
        options: KeyframeAnimationOptions,
        onFinished: () => void
    ): void {
        this.cancelCurrentAnimation();
        const animation = this.dialog.animate(keyframes, options);
        animation.addEventListener('finish', onFinished);
    }

    private cancelCurrentAnimation(): void {
        this.dialog.getAnimations().forEach(animation => {
            if (animation.id === slideAnimationId) {
                animation.cancel();
            }
        });
    }
}

export const nimbleDrawer = Drawer.compose({
    baseName: 'drawer',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDrawer());

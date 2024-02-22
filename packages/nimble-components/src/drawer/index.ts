import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem
} from '@microsoft/fast-foundation';
import { eventAnimationEnd } from '@microsoft/fast-web-utilities';
import { UserDismissed } from '../patterns/dialog/types';
import { Modal, ModalState } from '../modal';
import { styles } from './styles';
import { template } from './template';
import { DrawerLocation } from './types';

export { UserDismissed };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-drawer': Drawer;
    }
}

/**
 * Drawer control. Shows content in a panel on the left / right side of the screen,
 * which animates to be visible with a slide-in / slide-out animation.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export class Drawer<CloseReason = void> extends Modal<CloseReason> {
    // We want the member to match the name of the constant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly UserDismissed = UserDismissed;

    @attr
    public location: DrawerLocation = DrawerLocation.right;

    private closeReason!: CloseReason | UserDismissed;

    /**
     * @internal
     */
    public override cancelHandler(event: Event): boolean {
        // Allowing the dialog to close itself bypasses the drawer's animation logic, so we
        // should close the drawer ourselves when preventDismiss is false.
        event.preventDefault();
        return super.cancelHandler(event);
    }

    protected override startOpening(): void {
        super.startOpening();
        this.triggerAnimation();
    }

    protected override startClosing(reason: CloseReason | UserDismissed): void {
        this.state = ModalState.closing;
        this.closeReason = reason;
        this.triggerAnimation();
    }

    private readonly animationEndHandlerFunction = (): void => this.animationEndHandler();

    private triggerAnimation(): void {
        this.dialogElement.classList.add('animating');
        if (this.state === ModalState.closing) {
            this.dialogElement.classList.add('closing');
        }

        this.dialogElement.addEventListener(
            eventAnimationEnd,
            this.animationEndHandlerFunction
        );
    }

    private animationEndHandler(): void {
        this.dialogElement.removeEventListener(
            eventAnimationEnd,
            this.animationEndHandlerFunction
        );
        this.dialogElement.classList.remove('animating');
        if (this.state === ModalState.closing) {
            this.dialogElement.classList.remove('closing');
            this.finishClosing(this.closeReason);
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Drawer extends ARIAGlobalStatesAndProperties {}
applyMixins(Drawer, ARIAGlobalStatesAndProperties);

const nimbleDrawer = Drawer.compose({
    baseName: 'drawer',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDrawer());
export const drawerTag = 'nimble-drawer';

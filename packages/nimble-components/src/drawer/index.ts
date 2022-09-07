import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { eventAnimationEnd } from '@microsoft/fast-web-utilities';
import { USER_DISMISSED, UserDismissed } from '../patterns/dialog/constants';
import { styles } from './styles';
import { template } from './template';
import { DrawerLocation } from './types';

export { USER_DISMISSED, UserDismissed } from '../patterns/dialog/constants';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-drawer': Drawer;
    }
}

/**
 * Drawer control. Shows content in a panel on the left / right side of the screen,
 * which animates to be visible with a slide-in / slide-out animation.
 */
export class Drawer<CloseReason = void> extends FoundationElement {
    // We want the member to match the name of the constant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly USER_DISMISSED = USER_DISMISSED;

    @attr
    public location: DrawerLocation = DrawerLocation.left;

    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    public dialog!: HTMLDialogElement;
    private closing = false;

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;
    private closeReason!: CloseReason | UserDismissed;

    /**
     * True if the drawer is open, opening, or closing. Otherwise, false.
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    /**
     * Opens the drawer
     * @returns Promise that is resolved when the drawer finishes closing. The value of the resolved
     * Promise is the reason value passed to the close() method, or  USER_DISMISSED if the drawer was
     * closed via the ESC key.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (this.open) {
            throw new Error('Drawer is already open');
        }
        this.openDialog();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    /**
     * Closes the drawer
     * @param reason An optional value indicating how/why the drawer was closed.
     */
    public close(reason: CloseReason): void {
        if (!this.open || this.closing) {
            throw new Error('Drawer is not open or already closing');
        }
        this.closeReason = reason;
        this.closeDialog();
    }

    /**
     * @internal
     */
    public cancelHandler(event: Event): boolean {
        // Allowing the dialog to close itself bypasses the drawer's animation logic, so we
        // should close the drawer ourselves when preventDismiss is not true.
        event.preventDefault();

        if (!this.preventDismiss) {
            this.closeReason = USER_DISMISSED;
            this.closeDialog();
        }
        return true;
    }

    private readonly animationEndHandlerFunction = (): void => this.animationEndHandler();

    private openDialog(): void {
        this.dialog.showModal();
        this.triggerAnimation(true);
    }

    private closeDialog(): void {
        this.triggerAnimation(false);
    }

    private triggerAnimation(opening: boolean): void {
        this.closing = !opening;
        this.dialog.classList.add('animating');
        if (this.closing) {
            this.dialog.classList.add('closing');
        }

        this.dialog.addEventListener(eventAnimationEnd, this.animationEndHandlerFunction);
    }

    private animationEndHandler(): void {
        this.dialog.removeEventListener(eventAnimationEnd, this.animationEndHandlerFunction);
        this.dialog.classList.remove('animating');
        if (this.closing) {
            this.dialog.classList.remove('closing');
            this.dialog.close();
            this.closing = false;
            this.resolveShow!(this.closeReason);
            this.resolveShow = undefined;
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
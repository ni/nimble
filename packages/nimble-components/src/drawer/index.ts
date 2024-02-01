import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { eventAnimationEnd } from '@microsoft/fast-web-utilities';
import type { ExtendedDialog } from '../dialog';
import { UserDismissed } from '../patterns/dialog/types';
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
export class Drawer<CloseReason = void> extends FoundationElement {
    // We want the member to match the name of the constant
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly UserDismissed = UserDismissed;

    @attr
    public location: DrawerLocation = DrawerLocation.right;

    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    public dialog!: ExtendedDialog;
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
     * Promise is the reason value passed to the close() method, or UserDismissed if the drawer was
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
        // should close the drawer ourselves when preventDismiss is false.
        event.preventDefault();

        if (!this.preventDismiss) {
            this.closeReason = UserDismissed;
            this.closeDialog();
        }
        return true;
    }

    /**
     * @internal
     */
    public closeHandler(): void {
        if (this.resolveShow) {
            // This happens if all of the following are true:
            //   1. the browser implements dialogs with the CloseWatcher API
            //   2. preventDismiss is true
            //   3. nothing in the drawer has focus
            //   4. the user pressed ESC twice without intervening user interaction (e.g. clicking)
            // In that case, cancel is not fired because of #1 & #4, we don't get a keydown
            // because of #3, and the dialog just closes (without animation).
            // Ideally, preventDismiss should always prevent ESC from closing the dialog,
            // but we can't work around this corner case.
            this.resolveShow(UserDismissed);
            this.resolveShow = undefined;
        }
    }

    /**
     * @internal
     */
    public keydownHandler(event: KeyboardEvent): boolean {
        // Historically, we could expect a cancel event to fire every time the user presses ESC,
        // so a separate keydownHandler would not be needed. But with the advent of the CloseWatcher
        // API, cancel is not fired if there was no user interaction since the last ESC
        // (https://github.com/WICG/close-watcher?tab=readme-ov-file#asking-for-confirmation).
        // In that case, we have to rely on handling keydown instead. But we only get a keydown
        // if an element within the drawer has focus.
        return event.key === 'Escape' ? this.cancelHandler(event) : true;
    }

    private readonly animationEndHandlerFunction = (): void => this.animationEndHandler();

    private openDialog(): void {
        this.dialog.showModal();
        this.triggerAnimation();
    }

    private closeDialog(): void {
        this.closing = true;
        this.triggerAnimation();
    }

    private triggerAnimation(): void {
        this.dialog.classList.add('animating');
        if (this.closing) {
            this.dialog.classList.add('closing');
        }

        this.dialog.addEventListener(
            eventAnimationEnd,
            this.animationEndHandlerFunction
        );
    }

    private animationEndHandler(): void {
        this.dialog.removeEventListener(
            eventAnimationEnd,
            this.animationEndHandlerFunction
        );
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
export const drawerTag = 'nimble-drawer';

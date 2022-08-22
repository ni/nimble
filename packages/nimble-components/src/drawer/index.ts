import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    Dialog,
    FoundationElement
} from '@microsoft/fast-foundation';
import { eventTransitionEnd } from '@microsoft/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { DrawerLocation } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-drawer': Drawer;
    }
}

/**
 * Symbol that is returned as the dialog close reason (from the Promise returned by show()) when
 * the drawer was closed by pressing the ESC key (vs. calling the close() function).
 */
export const USER_DISMISSED: unique symbol = Symbol('user dismissed');
export type UserDismissed = typeof USER_DISMISSED;

/**
 * TODOs:
 * - turn off animations when prefers reduced motion is set
 * - figure out why exposing USER_DISMISSED isn't working correctly in Angular (duplicate export?)
 * - slide-in animations don't work from the right when width is set to 'fit-content'
 */

/**
 * Drawer/Sidenav control. Shows content in a panel on the left / right side of the screen,
 * which animates to be visible with a slide-in / slide-out animation.
 */
export class Drawer<CloseReason = void> extends FoundationElement {
    @attr
    public location: DrawerLocation = DrawerLocation.left;

    @attr({ attribute: 'prevent-dismiss', mode: 'boolean' })
    public preventDismiss = false;

    public dialog!: HTMLDialogElement;
    private closing = false;

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;
    private closeReason!: CloseReason | UserDismissed;

    /**
     * True if the dialog is open/showing, false otherwise
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    /**
     * Opens the drawer
     * @returns Promise that is resolved when the drawer is closed. The value of the resolved Promise is the reason value passed to the close() method, or
     * USER_DISMISSED if the dialog was closed via the ESC key or clicking off the drawer.
     */
    public async show(): Promise<CloseReason | UserDismissed> {
        if (this.open) {
            throw new Error('Dialog is already open');
        }
        this.openDialog();
        return new Promise((resolve, _reject) => {
            this.resolveShow = resolve;
        });
    }

    /**
     * Closes the dialog
     * @param reason An optional value indicating how/why the dialog was closed.
     */
    public close(reason: CloseReason): void {
        if (!this.open || this.closing) {
            throw new Error('Dialog is not open');
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

    private readonly transitionEndHandlerFunction = (): void => this.transitionEndHandler();

    private openDialog(): void {
        this.dialog.showModal();
        this.triggerAnimation(true);
    }

    private closeDialog(): void {
        this.triggerAnimation(false);
    }

    private triggerAnimation(opening: boolean): void {
        this.closing = !opening;
        if (opening) {
            this.dialog.classList.add('open');
        } else {
            this.dialog.classList.remove('open');
        }

        this.dialog.addEventListener(eventTransitionEnd, this.transitionEndHandlerFunction);
    }

    private transitionEndHandler(): void {
        this.dialog.removeEventListener(eventTransitionEnd, this.transitionEndHandlerFunction);
        if (this.closing) {
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
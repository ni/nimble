import { attr } from '@microsoft/fast-element';
import {
    applyMixins,
    ARIAGlobalStatesAndProperties,
    DesignSystem,
    FoundationElement
} from '@microsoft/fast-foundation';
import { UserDismissed } from '../patterns/dialog/types';
import { styles } from './styles';
import { template } from './template';
import { DrawerLocation } from './types';
import { prefersReducedMotionMediaQuery } from '../utilities/style/prefers-reduced-motion';
import { largeDelay } from '../theme-provider/design-tokens';

export { UserDismissed };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-drawer': Drawer;
    }
}

const slideInLeftKeyframes: Keyframe[] = [
    { transform: 'translate(-100%)' },
    { transform: 'translate(0%)' }
];
const slideInRightKeyframes: Keyframe[] = [
    { transform: 'translate(100%)' },
    { transform: 'translate(0%)' }
];
const fadeInKeyFrames: Keyframe[] = [
    { opacity: '0' },
    { opacity: '1' }
];

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

    public dialog!: HTMLDialogElement;
    public dialogContents!: HTMLElement;
    /** @internal */
    public animations: Animation[] = [];
    private closing = false;

    private resolveShow?: (reason: CloseReason | UserDismissed) => void;
    private closeReason!: CloseReason | UserDismissed;


    /**
     * True if the drawer is open, opening, or closing. Otherwise, false.
     */
    public get open(): boolean {
        return this.resolveShow !== undefined;
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.cancelCurrentAnimations();
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
    public closeHandler(event: Event): void {
        if (event.target !== this.dialog) {
            return;
        }
        if (this.resolveShow) {
            // If
            // - the browser implements dialogs with the CloseWatcher API, and
            // - the user presses ESC without first interacting with the drawer (e.g. clicking, scrolling),
            // the cancel event is not fired, but the close event still is, and the drawer just closes.
            // The animation is never started, so there is no animation end listener to clean up.
            this.doResolveShow(UserDismissed);
        }
    }

    private doResolveShow(reason: CloseReason | UserDismissed): void {
        if (!this.resolveShow) {
            throw new Error(
                'Do not call doResolveShow unless there is a promise to resolve'
            );
        }
        this.resolveShow(reason);
        this.resolveShow = undefined;
    }

    private openDialog(): void {
        this.dialog.showModal();
        void this.triggerAnimation();
    }

    private closeDialog(): void {
        this.closing = true;
        void this.triggerAnimation();
    }

    private async triggerAnimation(): Promise<void> {
        if (this.animations.length !== 0) {
            this.animations.forEach(x => x.reverse());
            return;
        }

        const drawerAnimation = this.dialogContents.animate(
            this.getSlideInKeyframes(),
            this.getAnimationOptions(false)
        );
        const backdropAnimation = this.dialog.animate(
            fadeInKeyFrames,
            this.getAnimationOptions(true)
        );
        this.animations.push(drawerAnimation);
        this.animations.push(backdropAnimation);

        try {
            await Promise.all([drawerAnimation.finished, backdropAnimation.finished]);

            this.animations = [];
            if (this.closing) {
                this.dialog.close();
                this.closing = false;
                this.doResolveShow(this.closeReason);
            }
        } catch (_) {
            // Do nothing -- the animation promises are rejected if the animation is cancelled.
        }
    }

    private getSlideInKeyframes(): Keyframe[] {
        if (prefersReducedMotionMediaQuery.matches) {
            return fadeInKeyFrames;
        }

        return this.location === DrawerLocation.right
            ? slideInRightKeyframes
            : slideInLeftKeyframes;
    }

    private getAnimationOptions(isBackdrop: boolean): KeyframeAnimationOptions {
        const options: KeyframeAnimationOptions = {
            // duration: largeDelay.getValueFor(this),
            duration: 1500,
            easing: 'ease-in'
        };
        if (this.closing) {
            options.direction = 'reverse';
        }
        if (isBackdrop) {
            options.pseudoElement = '::backdrop';
        }
        return options;
    }

    private cancelCurrentAnimations(): void {
        this.animations.forEach(x => x.cancel());
        this.animations = [];
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

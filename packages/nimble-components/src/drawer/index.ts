import { AnimateGroup, AnimateTo } from '@microsoft/fast-animation';
import {
    attr,
    Notifier,
    Observable,
    Subscriber
} from '@microsoft/fast-element';
import {
    DesignSystem,
    Dialog as FoundationDialog,
    dialogTemplate as template
} from '@microsoft/fast-foundation';
import { drawerAnimationDurationMs } from '../theme-provider/design-tokens';
import { animationConfig } from './animations';
import { styles } from './styles';
import { DrawerLocation, DrawerState } from './types';

const animationDurationWhenDisabledMilliseconds = 0.001;

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

    private readonly propertiesToWatch = ['hidden', 'location', 'state'];
    private propertyChangeNotifier?: Notifier;

    private animationDurationMilliseconds =
    animationDurationWhenDisabledMilliseconds;

    private animationGroup?: AnimateGroup;
    private animationsEnabledChangedHandler?: (MediaQueryListEvent) => void;
    private prefersReducedMotionMediaQuery?: MediaQueryList;
    private propertyChangeSubscriber?: Subscriber;

    public connectedCallback(): void {
        // disable trapFocus before super.connectedCallback as FAST Dialog will immediately queue work to
        // change focus if it's true before connectedCallback
        this.trapFocus = false;
        super.connectedCallback();
        this.prefersReducedMotionMediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );
        this.updateAnimationDuration();
        this.animationsEnabledChangedHandler = () => this.updateAnimationDuration();
        this.prefersReducedMotionMediaQuery.addEventListener(
            'change',
            this.animationsEnabledChangedHandler
        );
        this.onStateChanged();
        const notifier = Observable.getNotifier(this);
        const subscriber: Subscriber = {
            handleChange: (_source: unknown, propertyName: string) => this.onPropertyChange(propertyName)
        };
        this.propertiesToWatch.forEach(propertyName => notifier.subscribe(subscriber, propertyName));
        this.propertyChangeSubscriber = subscriber;
        this.propertyChangeNotifier = notifier;
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.cancelCurrentAnimation();
        if (this.propertyChangeNotifier && this.propertyChangeSubscriber) {
            this.propertiesToWatch.forEach(propertyName => this.propertyChangeNotifier!.unsubscribe(
                this.propertyChangeSubscriber!,
                propertyName
            ));
            this.propertyChangeNotifier = undefined;
            this.propertyChangeSubscriber = undefined;
        }
        if (
            this.prefersReducedMotionMediaQuery
            && this.animationsEnabledChangedHandler
        ) {
            this.prefersReducedMotionMediaQuery.removeEventListener(
                'change',
                this.animationsEnabledChangedHandler
            );
            this.prefersReducedMotionMediaQuery = undefined;
            this.animationsEnabledChangedHandler = undefined;
        }
    }

    public override show(): void {
        // Not calling super.show() as that will immediately show the drawer, whereas 'Opening' state will animate
        this.state = DrawerState.Opening;
    }

    public override hide(): void {
        // Not calling super.hide() as that will immediately hide the drawer, whereas 'Closing' state will animate
        this.state = DrawerState.Closing;
    }

    public override dismiss(): void {
        if (!this.preventDismiss) {
            super.dismiss();
            this.hide();
        }
    }

    private onPropertyChange(propertyName: string): void {
        switch (propertyName) {
            case 'hidden':
                this.onHiddenChanged();
                break;
            case 'location':
                this.onLocationChanged();
                break;
            case 'state':
                this.onStateChanged();
                break;
            default:
                break;
        }
    }

    private onHiddenChanged(): void {
        if (this.hidden && this.state !== DrawerState.Closed) {
            this.state = DrawerState.Closed;
        } else if (!this.hidden && this.state === DrawerState.Closed) {
            this.state = DrawerState.Opened;
        }
    }

    private onLocationChanged(): void {
        this.cancelCurrentAnimation();
    }

    private onStateChanged(): void {
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
            this.$emit('state-change');
        }
    }

    private updateAnimationDuration(): void {
        const disableAnimations = this.prefersReducedMotionMediaQuery?.matches;
        this.animationDurationMilliseconds = disableAnimations
            ? animationDurationWhenDisabledMilliseconds
            : drawerAnimationDurationMs.getValueFor(this);
    }

    private animateOpening(): void {
        this.animateOpenClose(true);
    }

    private animateClosing(): void {
        if (!this.hidden) {
            this.animateOpenClose(false);
        } else {
            this.state = DrawerState.Closed;
        }
    }

    private animateOpenClose(drawerOpening: boolean): void {
        const options = {
            ...(drawerOpening
                ? animationConfig.slideInOptions
                : animationConfig.slideOutOptions),
            duration: this.animationDurationMilliseconds
        };
        const drawerKeyframes = this.location === DrawerLocation.Right
            ? animationConfig.slideRightKeyframes
            : animationConfig.slideLeftKeyframes;
        const dialogAnimation = new AnimateTo(this.dialog, undefined, options);
        dialogAnimation.addKeyframes(drawerKeyframes);
        const animations = [dialogAnimation];
        const overlay = this.shadowRoot?.querySelector('.overlay');
        if (overlay) {
            const overlayAnimation = new AnimateTo(
                overlay as HTMLElement,
                undefined,
                options
            );
            overlayAnimation.addKeyframes(animationConfig.fadeOverlayKeyframes);
            animations.push(overlayAnimation);
        }

        const animationGroup = new AnimateGroup(animations);
        animationGroup.onFinish = () => {
            this.state = drawerOpening
                ? DrawerState.Opened
                : DrawerState.Closed;
        };
        this.animationGroup = animationGroup;
        animationGroup.play();
    }

    private cancelCurrentAnimation(): void {
        this.animationGroup?.cancel();
    }
}

export const nimbleDrawer = Drawer.compose({
    baseName: 'drawer',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDrawer());

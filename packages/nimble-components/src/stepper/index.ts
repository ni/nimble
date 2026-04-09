import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { StepperOrientation } from './types';
import type { StepPattern } from '../patterns/step/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-stepper': Stepper;
    }
}

/**
 * A nimble-styled stepper
 */
export class Stepper extends FoundationElement {
    @attr
    public orientation: StepperOrientation = StepperOrientation.horizontal;

    /**
     * @internal
     */
    @observable
    public showScrollButtons = false;

    /** @internal */
    @observable
    public steps?: (StepPattern)[];

    /**
     * @internal
     */
    public list!: HTMLElement;

    /**
     * @internal
     */
    public readonly startScrollButton?: HTMLElement;

    private listIntersectionObserver?: IntersectionObserver;

    /**
     * @internal
     */
    public onScrollStartClick(): void {
        if (this.orientation === StepperOrientation.horizontal) {
            this.list.scrollBy({
                left: -this.list.clientWidth,
                behavior: 'smooth'
            });
        } else {
            this.list.scrollBy({
                top: -this.list.clientHeight,
                behavior: 'smooth'
            });
        }
    }

    /**
     * @internal
     */
    public onScrollEndClick(): void {
        if (this.orientation === StepperOrientation.horizontal) {
            this.list.scrollBy({
                left: this.list.clientWidth,
                behavior: 'smooth'
            });
        } else {
            this.list.scrollBy({
                top: this.list.clientHeight,
                behavior: 'smooth'
            });
        }
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        // Steps fill parent container so can't rely on a resize observer to track their space usage.
        // Instead directly track each step's occlusion with intersection observer which is more compute intensive.
        // When available can switch to container scroll state queries, see: https://github.com/ni/nimble/issues/2922
        this.listIntersectionObserver = new IntersectionObserver(_ => {
            this.handleListOverflow();
        }, {
            root: this.list,
            threshold: 1.0
        });
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.listIntersectionObserver?.disconnect();
    }

    private orientationChanged(): void {
        this.updateStepInternals();
    }

    private stepsChanged(): void {
        this.updateStepInternals();
        this.listIntersectionObserver?.disconnect();
        if (this.steps) {
            this.steps.forEach(step => this.listIntersectionObserver?.observe(step));
        }
    }

    private updateStepInternals(): void {
        if (!this.steps) {
            return;
        }
        const lastIndex = this.steps.length - 1;
        this.steps.forEach((step, index) => {
            step.stepInternals.orientation = this.orientation;
            step.stepInternals.last = index === lastIndex;
            step.stepInternals.position = index + 1;
        });
    }

    private handleListOverflow(): void {
        const isHorizontal = this.orientation === StepperOrientation.horizontal;
        let listVisibleSize = isHorizontal
            ? this.list.clientWidth
            : this.list.clientHeight;
        if (listVisibleSize !== undefined) {
            const buttonSize = isHorizontal
                ? this.startScrollButton?.clientWidth ?? 0
                : this.startScrollButton?.clientHeight ?? 0;
            listVisibleSize = Math.ceil(listVisibleSize);
            if (this.showScrollButtons) {
                listVisibleSize += buttonSize * 2;
            }
            const listScrollSize = isHorizontal
                ? this.list.scrollWidth
                : this.list.scrollHeight;
            this.showScrollButtons = listVisibleSize < listScrollSize;
        }
    }
}

const nimbleStepper = Stepper.compose({
    baseName: 'stepper',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStepper());
export const stepperTag = 'nimble-stepper';

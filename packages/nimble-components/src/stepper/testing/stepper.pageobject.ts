import type { Button } from '../../button';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { waitTimeout } from '../../utilities/testing/component';
import type { Stepper } from '..';
import { stepTag } from '../../step';
import { StepperOrientation } from '../types';

/**
 * Page object for the `nimble-stepper`
 */
export class StepperPageObject {
    public constructor(protected readonly element: Stepper) {}

    public async setStepperScrollAxisSize(size: number): Promise<void> {
        if (this.element.orientation === StepperOrientation.horizontal) {
            this.element.style.width = `${size}px`;
        } else {
            this.element.style.height = `${size}px`;
        }
        await waitForUpdatesAsync();
        await waitForUpdatesAsync(); // wait for the resize observer to fire
    }

    public async clickScrollStartButton(): Promise<void> {
        const startButton = this.element.shadowRoot!.querySelector<Button>(
            '.scroll-button.start'
        );
        if (!startButton) {
            throw new Error('Scroll start button not found');
        }
        startButton.click();
        await waitForUpdatesAsync();
        await waitTimeout(50); // let animation run
    }

    public async clickScrollEndButton(): Promise<void> {
        const endButton = this.element.shadowRoot!.querySelector<Button>(
            '.scroll-button.end'
        );
        if (!endButton) {
            throw new Error('Scroll end button not found');
        }
        endButton.click();
        await waitForUpdatesAsync();
        await waitTimeout(50); // let animation run
    }

    public areScrollButtonsVisible(): boolean {
        return (
            this.element.shadowRoot!.querySelectorAll(
                '.scroll-button'
            ).length > 0
        );
    }

    public getStepperViewScrollOffset(): number {
        const list = this.element.shadowRoot!.querySelector('.list')!;
        return this.element.orientation === 'horizontal'
            ? list.scrollLeft
            : list.scrollTop;
    }

    public async scrollStepIntoViewByIndex(index: number): Promise<void> {
        const steps = this.element.steps;
        if (!steps || index >= steps.length) {
            throw new Error(`Step with index ${index} not found`);
        }
        steps[index]!.scrollIntoView();
        await waitForUpdatesAsync();
    }

    public async addStep(title?: string): Promise<void> {
        const step = document.createElement(stepTag);
        step.appendChild(Object.assign(document.createElement('span'), {
            slot: 'title',
            textContent: title ?? ''
        }));
        this.element.appendChild(step);
        await waitForUpdatesAsync();
        await waitForUpdatesAsync(); // wait for overflow check queued by stepsChanged
    }

    public async removeStepByIndex(index: number): Promise<void> {
        const steps = this.element.steps;
        if (!steps || index >= steps.length) {
            throw new Error(`Step with index ${index} not found`);
        }
        steps[index]!.remove();
        await waitForUpdatesAsync();
        await waitForUpdatesAsync(); // wait for overflow check queued by stepsChanged
    }

    public async updateStepTitle(
        index: number,
        title: string
    ): Promise<void> {
        const steps = this.element.steps;
        if (!steps || index >= steps.length) {
            throw new Error(`Step with index ${index} not found`);
        }
        const step = steps[index]!;
        const titleSlot = step.querySelector('[slot="title"]');
        if (!titleSlot) {
            throw new Error(`No slot="title" element found to update for step with index ${index}`);
        }
        titleSlot.textContent = title;
        await waitForUpdatesAsync();
        await waitForUpdatesAsync();
    }
}

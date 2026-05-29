import { html, observable, ref } from '@ni/fast-element';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { Stepper, stepperTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Step, stepTag } from '../../step';
import { AnchorStep, anchorStepTag } from '../../anchor-step';
import { themeProviderTag } from '../../theme-provider';
import { LabelProviderCore, labelProviderCoreTag } from '../../label-provider/core';
import { StepPageObject } from '../../step/testing/step.pageobject';
import { AnchorStepPageObject } from '../../anchor-step/testing/anchor-step.pageobject';
import type { StepBasePageObject } from '../../patterns/step/testing/step-base.pageobject';
import { Severity } from '../../patterns/severity/types';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { StepperPageObject } from '../testing/stepper.pageobject';
import { StepperOrientation } from '../types';

describe('Stepper', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(stepperTag)).toBeInstanceOf(Stepper);
    });

    it('has default orientation horizontal', () => {
        expect(document.createElement(stepperTag).orientation).toBe('horizontal');
    });

    function createStepPageObject(step: Step | AnchorStep): StepBasePageObject {
        return step instanceof Step ? new StepPageObject(step) : new AnchorStepPageObject(step);
    }

    const stepperTests = [
        { name: 'step', stepTypeTag: stepTag },
        { name: 'anchor step', stepTypeTag: anchorStepTag },
    ] as const;
    parameterizeSuite(stepperTests, (suite, name, value) => {
        suite(`with ${name}`, () => {
            describe('count single', () => {
                class Model {
                    @observable public step!: Step | AnchorStep;
                    public stepPageObject!: StepBasePageObject;
                }

                async function setup(): Promise<Fixture<Stepper> & { model: Model }> {
                    const model = new Model();
                    const result = await fixture<Stepper>(
                        html<Model>`
                            <${stepperTag}>
                                <${value.stepTypeTag} ${ref('step')}></${value.stepTypeTag}>
                            </${stepperTag}>
                        `,
                        { source: model }
                    );
                    model.stepPageObject = createStepPageObject(model.step);
                    return { ...result, model };
                }

                let element: Stepper;
                let connect: () => Promise<void>;
                let disconnect: () => Promise<void>;
                let model: Model;

                beforeEach(async () => {
                    ({ connect, element, model, disconnect } = await setup());
                    await connect();
                });

                afterEach(async () => {
                    await disconnect();
                });

                it('configures stepInternals last', () => {
                    expect(model.step.stepInternals.last).toBe(true);
                });

                it('configures stepInternals orientation default', () => {
                    expect(model.step.stepInternals.orientation).toBe('horizontal');
                });

                it('configures stepInternals orientation vertical', async () => {
                    element.orientation = 'vertical';
                    await waitForUpdatesAsync();
                    expect(model.step.stepInternals.orientation).toBe('vertical');
                });
            });

            describe('count multiple', () => {
                class Model {
                    @observable public step1!: Step | AnchorStep;
                    public step1PageObject!: StepBasePageObject;
                    @observable public step2!: Step | AnchorStep;
                    public step2PageObject!: StepBasePageObject;
                }

                async function setup(): Promise<Fixture<Stepper> & { model: Model }> {
                    const model = new Model();
                    const result = await fixture<Stepper>(
                        html<Model>`
                            <${stepperTag}>
                                <${value.stepTypeTag} ${ref('step1')}></${value.stepTypeTag}>
                                <${value.stepTypeTag} ${ref('step2')}></${value.stepTypeTag}>
                            </${stepperTag}>
                        `,
                        { source: model }
                    );
                    model.step1PageObject = createStepPageObject(model.step1);
                    model.step2PageObject = createStepPageObject(model.step2);
                    return { ...result, model };
                }

                let element: Stepper;
                let connect: () => Promise<void>;
                let disconnect: () => Promise<void>;
                let model: Model;

                beforeEach(async () => {
                    ({ connect, element, model, disconnect } = await setup());
                    await connect();
                });

                afterEach(async () => {
                    await disconnect();
                });

                it('to configure stepInternals last', () => {
                    expect(model.step1.stepInternals.last).toBe(false);
                    expect(model.step2.stepInternals.last).toBe(true);
                });

                it('configures stepInternals orientation default', () => {
                    expect(model.step1.stepInternals.orientation).toBe('horizontal');
                    expect(model.step2.stepInternals.orientation).toBe('horizontal');
                });

                it('configures stepInternals orientation vertical', async () => {
                    element.orientation = 'vertical';
                    await waitForUpdatesAsync();
                    expect(model.step1.stepInternals.orientation).toBe('vertical');
                    expect(model.step2.stepInternals.orientation).toBe('vertical');
                });
            });

            describe('with label provider', () => {
                class Model {
                    @observable public step!: Step | AnchorStep;
                    public stepPageObject!: StepBasePageObject;
                    @observable public labelProvider!: LabelProviderCore;
                }

                async function setup(): Promise<Fixture<Stepper> & { model: Model }> {
                    const model = new Model();
                    const result = await fixture<Stepper>(
                        html<Model>`
                        <${themeProviderTag}>
                            <${labelProviderCoreTag} ${ref('labelProvider')}></${labelProviderCoreTag}>
                            <${stepperTag}>
                                <${value.stepTypeTag} ${ref('step')}></${value.stepTypeTag}>
                            </${stepperTag}>
                        </${themeProviderTag}>
                        `,
                        { source: model }
                    );
                    model.stepPageObject = createStepPageObject(model.step);
                    return { ...result, model };
                }

                let connect: () => Promise<void>;
                let disconnect: () => Promise<void>;
                let model: Model;

                beforeEach(async () => {
                    ({ connect, model, disconnect } = await setup());
                    await connect();
                });

                afterEach(async () => {
                    await disconnect();
                });

                it('uses CoreLabelProvider popupIconCompleted for the error icon label', async () => {
                    model.step.severity = Severity.error;
                    model.labelProvider.popupIconError = 'Custom error';
                    await waitForUpdatesAsync();
                    expect(model.stepPageObject.getErrorSeverityLabel()).toBe('Custom error');
                });

                it('uses CoreLabelProvider popupIconWarning for the warning icon label', async () => {
                    model.step.severity = Severity.warning;
                    model.labelProvider.popupIconWarning = 'Custom warning';
                    await waitForUpdatesAsync();
                    expect(model.stepPageObject.getWarningSeverityLabel()).toBe('Custom warning');
                });

                it('uses CoreLabelProvider popupIconCompleted for the success icon label', async () => {
                    model.step.severity = Severity.success;
                    model.labelProvider.popupIconCompleted = 'Custom success';
                    await waitForUpdatesAsync();
                    expect(model.stepPageObject.getSuccessSeverityLabel()).toBe('Custom success');
                });

                it('uses CoreLabelProvider popupIconCurrent for the success icon label', async () => {
                    model.step.selected = true;
                    model.labelProvider.popupIconCurrent = 'Custom current';
                    await waitForUpdatesAsync();
                    expect(model.stepPageObject.getSelectedStateLabel()).toBe('Custom current');
                });
            });
            const orientationTests = [
                { name: StepperOrientation.horizontal },
                { name: StepperOrientation.vertical },
            ] as const;
            parameterizeSuite(orientationTests, (orientationSuite, orientationName) => {
                orientationSuite(`orientation (${orientationName})`, () => {
                    describe('step buttons', () => {
                        let stepperPageObject: StepperPageObject;
                        let element: Stepper;
                        let connect: () => Promise<void>;
                        let disconnect: () => Promise<void>;

                        async function setupScroll(): Promise<Fixture<Stepper>> {
                            return await fixture<Stepper>(
                                html`
                                    <${stepperTag} orientation="${orientationName}">
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                        <${value.stepTypeTag}><span slot="title"></span></${value.stepTypeTag}>
                                    </${stepperTag}>
                                `
                            );
                        }

                        beforeEach(async () => {
                            ({ element, connect, disconnect } = await setupScroll());
                            await connect();
                            stepperPageObject = new StepperPageObject(element);
                        });

                        afterEach(async () => {
                            await disconnect();
                        });

                        it('should not show scroll buttons when the steps fit within the container', () => {
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                        });

                        it('should show scroll buttons when the steps overflow the container', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200);
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeTrue();
                        });

                        it('should hide scroll buttons when the steps no longer overflow the container', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200); // first stepper overflow
                            await stepperPageObject.setStepperScrollAxisSize(3000); // then stepper fit
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                        });

                        it('should scroll backward when the start scroll button is clicked', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200);
                            await stepperPageObject.scrollStepIntoViewByIndex(5);
                            const currentScrollOffset = stepperPageObject.getStepperViewScrollOffset();
                            await stepperPageObject.clickScrollStartButton();
                            expect(
                                stepperPageObject.getStepperViewScrollOffset()
                            ).toBeLessThan(currentScrollOffset);
                        });

                        it('should not scroll backward when already at the start', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200);
                            await stepperPageObject.clickScrollStartButton();
                            expect(stepperPageObject.getStepperViewScrollOffset()).toBe(0);
                        });

                        it('should scroll forward when the end scroll button is clicked', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200);
                            await stepperPageObject.clickScrollEndButton();
                            expect(
                                stepperPageObject.getStepperViewScrollOffset()
                            ).toBeGreaterThan(0);
                        });

                        it('should not scroll forward when already at the end', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(200);
                            await stepperPageObject.scrollStepIntoViewByIndex(5);
                            const currentScrollOffset = stepperPageObject.getStepperViewScrollOffset();
                            await stepperPageObject.clickScrollEndButton();
                            expect(stepperPageObject.getStepperViewScrollOffset()).toBe(
                                currentScrollOffset
                            );
                        });

                        it('should show scroll buttons when a new step is added and steps overflow the container', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(400);
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                            // Title impact horizontal size but not vertical size
                            // Add several steps to cause either horizontal or vertical overflow
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeTrue();
                        });

                        it('should hide scroll buttons when a step is removed and steps no longer overflow the container', async () => {
                            await stepperPageObject.setStepperScrollAxisSize(400);
                            // Title impact horizontal size but not vertical size
                            // Add several steps to cause either horizontal or vertical overflow
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            await stepperPageObject.addStep();
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeTrue();
                            await stepperPageObject.removeStepByIndex(9);
                            await stepperPageObject.removeStepByIndex(8);
                            await stepperPageObject.removeStepByIndex(7);
                            await stepperPageObject.removeStepByIndex(6);
                            expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                        });

                        // Title contents only impact overflow in horizontal orientation
                        if (orientationName === StepperOrientation.horizontal) {
                            it('should show scroll buttons when step title is updated and steps overflow the container', async () => {
                                await stepperPageObject.setStepperScrollAxisSize(450);
                                expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                                await stepperPageObject.updateStepTitle(
                                    0,
                                    'New Item With Extremely Long Name'
                                );
                                expect(stepperPageObject.areScrollButtonsVisible()).toBeTrue();
                            });

                            it('should hide scroll buttons when step title is updated and steps no longer overflow the container', async () => {
                                await stepperPageObject.setStepperScrollAxisSize(550);
                                await stepperPageObject.addStep(
                                    'New Item With Extremely Long Name'
                                );
                                expect(stepperPageObject.areScrollButtonsVisible()).toBeTrue();
                                await stepperPageObject.updateStepTitle(6, 'Item 6');
                                expect(stepperPageObject.areScrollButtonsVisible()).toBeFalse();
                            });
                        }
                    });
                });
            });
        });
    });
});

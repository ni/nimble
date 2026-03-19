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
        });
    });
});

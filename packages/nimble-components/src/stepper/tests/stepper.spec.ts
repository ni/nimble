import { html, observable, ref, when } from '@ni/fast-element';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { Stepper, stepperTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { Step, stepTag } from '../../step';
import { anchorStepTag } from '../../anchor-step';

describe('Stepper', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(stepperTag)).toBeInstanceOf(Stepper);
    });

    it('has default orientation horizontal', () => {
        expect(document.createElement(stepperTag).orientation).toBe('horizontal');
    });

    const stepperTests = [
        { name: 'step', stepType: stepTag },
        { name: 'anchor step', stepType: anchorStepTag },
    ] as const;
    parameterizeSuite(stepperTests, (suite, name, value) => {
        suite(`with ${name}`, () => {
            class FixtureModel {
                @observable public step1!: Step;
                @observable public step2?: Step;
                @observable public multiple = false;
            }

            async function setup(source: FixtureModel): Promise<Fixture<Stepper>> {
                return await fixture<Stepper>(
                    html<FixtureModel>`<${stepperTag}>
                        <${value.stepType} ${ref('step1')}></${value.stepType}>
                        ${when(x => x.multiple, html<FixtureModel>`<${value.stepType} ${ref('step2')}></${value.stepType}>`)}
                    </${stepperTag}>`,
                    { source }
                );
            }

            describe('count single', () => {
                it('configures stepInternals last', async () => {
                    const model = new FixtureModel();
                    const { connect, disconnect } = await setup(model);
                    await connect();
                    expect(model.step1.stepInternals.last).toBe(true);
                    expect(model.step2).toBe(undefined);
                    await disconnect();
                });

                it('configures stepInternals orientation default', async () => {
                    const model = new FixtureModel();
                    const { connect, disconnect } = await setup(model);
                    await connect();
                    expect(model.step1.stepInternals.orientation).toBe('horizontal');
                    expect(model.step2).toBe(undefined);
                    await disconnect();
                });

                it('configures stepInternals orientation vertical set', async () => {
                    const model = new FixtureModel();
                    const { connect, element, disconnect } = await setup(model);
                    element.orientation = 'vertical';
                    await connect();
                    expect(model.step1.stepInternals.orientation).toBe('vertical');
                    expect(model.step2).toBe(undefined);
                    await disconnect();
                });
            });

            describe('count multiple', () => {
                it('to configure stepInternals last', async () => {
                    const model = new FixtureModel();
                    model.multiple = true;
                    const { connect, disconnect } = await setup(model);
                    await connect();
                    expect(model.step1.stepInternals.last).toBe(false);
                    expect(model.step2!.stepInternals.last).toBe(true);
                    await disconnect();
                });

                it('configures stepInternals orientation default', async () => {
                    const model = new FixtureModel();
                    model.multiple = true;
                    const { connect, disconnect } = await setup(model);
                    await connect();
                    expect(model.step1.stepInternals.orientation).toBe('horizontal');
                    expect(model.step2!.stepInternals.orientation).toBe('horizontal');
                    await disconnect();
                });

                it('configures stepInternals orientation vertical set', async () => {
                    const model = new FixtureModel();
                    model.multiple = true;
                    const { connect, element, disconnect } = await setup(model);
                    element.orientation = 'vertical';
                    await connect();
                    expect(model.step1.stepInternals.orientation).toBe('vertical');
                    expect(model.step2!.stepInternals.orientation).toBe('vertical');
                    await disconnect();
                });
            });
        });
    });
});

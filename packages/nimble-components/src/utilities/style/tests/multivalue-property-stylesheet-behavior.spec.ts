/* eslint-disable max-classes-per-file */

import {
    FASTElement,
    html,
    observable,
    css,
    ref,
    ElementStyles,
    DOM,
    Behavior,
    attr
} from '@microsoft/fast-element';
import { uniqueElementName, fixture } from '../../tests/fixture';
import type { Fixture } from '../../tests/fixture';
import { TestAppearance } from './types';
import { MultivaluePropertyStyleSheetBehavior } from '../multivalue-property-stylesheet-behavior';

const testAppearance = (
    value: TestAppearance | TestAppearance[],
    styles: ElementStyles
): Behavior => {
    return new MultivaluePropertyStyleSheetBehavior(
        'appearance',
        value,
        styles
    );
};

/**
 * Test element with property-aware styles
 */
class AppearanceElement extends FASTElement {
    public static template = html<AppearanceElement>`
        <div ${ref('appearanceTarget')}></div>
    `;

    public static allAppearanceStyles = css`
        div {
            --private-prop: appearance-default;
        }
    `.withBehaviors(
            testAppearance(
                TestAppearance.awesome,
                css`
                div {
                    --private-prop: appearance-awesome;
                }
            `
            ),
            testAppearance(
                TestAppearance.best,
                css`
                div {
                    --private-prop: appearance-best;
                }
            `
            )
        );

    public static sharedAppearanceStyles = css`
        div {
            --private-prop: appearance-default;
        }
    `.withBehaviors(
            testAppearance(
                [TestAppearance.awesome, TestAppearance.best],
                css`
                div {
                    --private-prop: appearance-awesome;
                }
            `
            )
        );

    public static unsetAppearanceStyles = css`
        div {
            --private-prop: appearance-default;
        }
    `.withBehaviors(
            testAppearance(
                TestAppearance.awesome,
                css`
                div {
                    --private-prop: appearance-awesome;
                }
            `
            )
        );

    @attr
    public appearance: TestAppearance;

    public appearanceTarget!: HTMLDivElement;

    public resolveApearanceStyle(): TestAppearance {
        const result = window
            .getComputedStyle(this.appearanceTarget)
            .getPropertyValue('--private-prop');

        if (result.includes('appearance-default')) {
            return TestAppearance.default;
        }
        if (result.includes('appearance-awesome')) {
            return TestAppearance.awesome;
        }
        if (result.includes('appearance-best')) {
            return TestAppearance.best;
        }
        throw new Error(`Unexpected property value: ${result}`);
    }
}

describe('The MultivaluePropertyStyleSheetBehavior', () => {
    describe('for a single element', () => {
        /**
         * Test helper to configure appearance
         */
        class AppearanceController {
            @observable
            public appearance: TestAppearance;

            public appearanceElement!: AppearanceElement;
        }

        const setup = async (
            appearanceController: AppearanceController,
            styles: ElementStyles
        ): Promise<Fixture> => {
            const name = uniqueElementName();
            const template = AppearanceElement.template;

            /** @inheritdoc */
            class AppearanceElementVariation extends AppearanceElement {
                public static definition = {
                    name,
                    template,
                    styles
                };
            }
            FASTElement.define(AppearanceElementVariation);

            const fixtureTemplate = html<AppearanceController>`
                <div>
                    <${name}
                        ${ref('appearanceElement')}
                        appearance=${x => x.appearance}
                    >
                    </${name}>
                </div>
            `;

            return fixture(fixtureTemplate, {
                source: appearanceController
            });
        };

        it('has a default appearance', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.allAppearanceStyles
            );
            await connect();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.default);
        });

        it('has an appearance of awesome', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.allAppearanceStyles
            );
            await connect();
            appearanceController.appearance = TestAppearance.awesome;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
        });

        it('responds to change of appearance from awesome to best', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.allAppearanceStyles
            );
            await connect();
            appearanceController.appearance = TestAppearance.awesome;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
            appearanceController.appearance = TestAppearance.best;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.best);
        });

        it('can share styles for appearances awesome and best', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.sharedAppearanceStyles
            );
            await connect();
            appearanceController.appearance = TestAppearance.awesome;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
            appearanceController.appearance = TestAppearance.best;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
        });

        it('can have an unset appearance best', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.unsetAppearanceStyles
            );
            await connect();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.default);
            appearanceController.appearance = TestAppearance.awesome;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
            appearanceController.appearance = TestAppearance.best;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement.resolveApearanceStyle()
            ).toBe(TestAppearance.default);
        });
    });

    describe('for multiple elements', () => {
        /**
         * Test helper to configure appearance
         */
        class AppearanceController {
            @observable
            public appearance1: TestAppearance;

            @observable
            public appearance2: TestAppearance;

            public appearanceElement1!: AppearanceElement;
            public appearanceElement2!: AppearanceElement;
        }

        const setup = async (
            appearanceController: AppearanceController,
            styles: ElementStyles
        ): Promise<Fixture> => {
            const name = uniqueElementName();
            const template = AppearanceElement.template;

            /** @inheritdoc */
            class AppearanceElementVariation extends AppearanceElement {
                public static definition = {
                    name,
                    template,
                    styles
                };
            }
            FASTElement.define(AppearanceElementVariation);

            const fixtureTemplate = html<AppearanceController>`
                <div>
                    <${name}
                        ${ref('appearanceElement1')}
                        appearance=${x => x.appearance1}
                    >
                    </${name}>
                    <${name}
                        ${ref('appearanceElement2')}
                        appearance=${x => x.appearance2}
                    >
                    </${name}>
                </div>
            `;

            return fixture(fixtureTemplate, {
                source: appearanceController
            });
        };

        it('can have one default and one awesome element', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.allAppearanceStyles
            );
            await connect();
            appearanceController.appearance2 = TestAppearance.awesome;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement1.resolveApearanceStyle()
            ).toBe(TestAppearance.default);
            expect(
                appearanceController.appearanceElement2.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
        });

        it('can have one awesome and one best element', async () => {
            const appearanceController = new AppearanceController();
            const { connect } = await setup(
                appearanceController,
                AppearanceElement.allAppearanceStyles
            );
            await connect();
            appearanceController.appearance1 = TestAppearance.awesome;
            appearanceController.appearance2 = TestAppearance.best;
            await DOM.nextUpdate();
            expect(
                appearanceController.appearanceElement1.resolveApearanceStyle()
            ).toBe(TestAppearance.awesome);
            expect(
                appearanceController.appearanceElement2.resolveApearanceStyle()
            ).toBe(TestAppearance.best);
        });
    });
});

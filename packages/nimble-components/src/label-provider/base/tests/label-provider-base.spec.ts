import { attr, customElement, html } from '@microsoft/fast-element';
import { DesignToken } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '..';
import { ThemeProvider, themeProviderTag } from '../../../theme-provider';
import {
    Fixture,
    fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { buttonTag } from '../../../button';

const exampleMessageLabelDefaultValue = 'Initial Value';
const exampleMessageLabel = DesignToken.create<string>({
    name: 'test-example-message-label',
    cssCustomPropertyName: null
}).withDefault(exampleMessageLabelDefaultValue);

describe('Label Provider Base', () => {
    let themeProvider: ThemeProvider;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    const testLabelProviderTag = uniqueElementName();
    @customElement({
        name: testLabelProviderTag
    })
    class LabelProviderTest extends LabelProviderBase {
        @attr({ attribute: 'example-message' })
        public exampleMessage?: string;

        protected override readonly supportedLabels: {
            [P in keyof LabelProviderTest]?: DesignToken<string>;
        } = {
                exampleMessage: exampleMessageLabel
            };
    }

    describe('with single theme provider', () => {
        async function setup(): Promise<Fixture<ThemeProvider>> {
            return fixture<ThemeProvider>(html`
                <${themeProviderTag}>
                </${themeProviderTag}>
            `);
        }

        beforeEach(async () => {
            ({ element: themeProvider, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('token values can be set before connected to DOM, and are set on target theme provider once attached', () => {
            const element = document.createElement(
                testLabelProviderTag
            ) as LabelProviderTest;
            element.exampleMessage = 'Updated Value';
            themeProvider.appendChild(element);

            const tokenValue = exampleMessageLabel.getValueFor(themeProvider);
            expect(tokenValue).toBe('Updated Value');
        });
    });

    describe('with 2 nested theme providers and initial label values', () => {
        async function setup(): Promise<Fixture<ThemeProvider>> {
            return fixture<ThemeProvider>(html`
                <${themeProviderTag}>
                    <${testLabelProviderTag} class="parent-provider" example-message="test-parent"></${testLabelProviderTag}>        
                    <${themeProviderTag}>
                        <${testLabelProviderTag} class="child-provider" example-message="test-child"></${testLabelProviderTag}>
                        <${buttonTag}></${buttonTag}>
                    </${themeProviderTag}>
                </${themeProviderTag}>
            `);
        }

        beforeEach(async () => {
            ({ element: themeProvider, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('token values cascade from parent providers correctly', () => {
            const parentLabelProvider: LabelProviderTest = themeProvider.querySelector('.parent-provider')!;
            const childLabelProvider: LabelProviderTest = themeProvider.querySelector('.child-provider')!;
            const elementUsingLabels: HTMLElement = themeProvider.querySelector(buttonTag)!;

            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-child'
            );

            childLabelProvider.exampleMessage = undefined;
            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-parent'
            );

            parentLabelProvider.exampleMessage = 'test-parent-new-value';
            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-parent-new-value'
            );

            childLabelProvider.exampleMessage = 'test-child-new-value';
            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-child-new-value'
            );

            childLabelProvider.removeAttribute('example-message');
            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-parent-new-value'
            );
        });
    });

    describe('with 2 nested theme providers without initial label values', () => {
        async function setup(): Promise<Fixture<ThemeProvider>> {
            return fixture<ThemeProvider>(html`
                <${themeProviderTag}>
                    <${testLabelProviderTag} class="parent-provider"></${testLabelProviderTag}>        
                    <${themeProviderTag}>
                        <${testLabelProviderTag} class="child-provider"></${testLabelProviderTag}>
                        <${buttonTag}></${buttonTag}>
                    </${themeProviderTag}>
                </${themeProviderTag}>
            `);
        }

        beforeEach(async () => {
            ({ element: themeProvider, connect, disconnect } = await setup());
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('token values cascade from parent providers correctly', () => {
            const parentLabelProvider: LabelProviderTest = themeProvider.querySelector('.parent-provider')!;
            const elementUsingLabels: HTMLElement = themeProvider.querySelector(buttonTag)!;

            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                exampleMessageLabelDefaultValue
            );

            parentLabelProvider.exampleMessage = 'test-parent-new-value';
            expect(exampleMessageLabel.getValueFor(elementUsingLabels)).toBe(
                'test-parent-new-value'
            );
        });
    });
});

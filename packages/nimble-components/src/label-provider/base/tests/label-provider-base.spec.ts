import { attr, customElement, html } from '@microsoft/fast-element';
import { DesignToken } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '..';
import { ThemeProvider, themeProviderTag } from '../../../theme-provider';
import {
    Fixture,
    fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ThemeProvider>> {
    return fixture<ThemeProvider>(html`
        <${themeProviderTag}>
        </${themeProviderTag}>
    `);
}

const exampleLabelDefaultValue = 'Initial Value';
const exampleLabel = DesignToken.create<string>({
    name: 'test-example-label',
    cssCustomPropertyName: null
}).withDefault(exampleLabelDefaultValue);

describe('Label Provider Base', () => {
    let themeProvider: ThemeProvider;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    const testLabelProviderTag = uniqueElementName();

    @customElement({
        name: testLabelProviderTag
    })
    class LabelProviderTest extends LabelProviderBase {
        @attr({
            attribute: 'test-example',
            mode: 'fromView'
        })
        public exampleLabel: string = exampleLabelDefaultValue;

        protected exampleLabelChanged(
            _prev: string | undefined,
            next: string | undefined
        ): void {
            this.handleTokenChanged(exampleLabel, next);
        }
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
        element.exampleLabel = 'Updated Value';
        themeProvider.appendChild(element);

        const tokenValue = exampleLabel.getValueFor(themeProvider);
        expect(tokenValue).toBe('Updated Value');
    });
});

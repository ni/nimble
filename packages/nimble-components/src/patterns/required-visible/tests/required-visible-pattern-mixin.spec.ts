import { customElement, html } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import {
    Fixture,
    fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { mixinRequiredVisiblePattern } from '../types';
import { styles } from '../styles';
import { getRequiredVisibleLabelTemplate } from '../template';
import { processUpdates } from '../../../testing/async-helpers';
import { RequiredVisiblePatternPageObject } from '../testing/required-visible-pattern.pageobject';

const labelTemplate = getRequiredVisibleLabelTemplate(
    html`<slot name="label"></slot>`
);
const elementName = uniqueElementName();
@customElement({
    name: elementName,
    template: html`${labelTemplate}`,
    styles
})
class TestErrorPatternElement extends mixinRequiredVisiblePattern(
        FoundationElement
    ) {}

async function setup(): Promise<Fixture<TestErrorPatternElement>> {
    return await fixture(elementName);
}

describe('RequiredVisiblePatternMixin', () => {
    let element: TestErrorPatternElement;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: RequiredVisiblePatternPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new RequiredVisiblePatternPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults requiredVisible to false', () => {
        expect(element.requiredVisible).toBeFalse();
    });

    it('shows icon when requiredVisible is true', () => {
        element.requiredVisible = true;
        processUpdates();
        expect(pageObject.isRequiredVisibleIconVisible()).toBeTrue();
    });

    it('does not show icon when requiredVisible is false', () => {
        element.requiredVisible = false;
        processUpdates();
        expect(pageObject.isRequiredVisibleIconVisible()).toBeFalse();
    });

    it('uses boolean "required-visible" attribute to set requiredVisible', () => {
        element.setAttribute('required-visible', '');
        processUpdates();
        expect(element.requiredVisible).toBeTrue();
    });
});

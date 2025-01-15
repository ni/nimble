import { customElement, html } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import {
    Fixture,
    fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { mixinErrorPattern } from '../types';
import { styles } from '../styles';
import { errorTextTemplate } from '../template';
import { iconExclamationMarkTag } from '../../../icons/exclamation-mark';
import { processUpdates } from '../../../testing/async-helpers';
import { ErrorPatternPageObject } from '../testing/error-pattern.pageobject';

const elementName = uniqueElementName();
@customElement({
    name: elementName,
    template: html`<${iconExclamationMarkTag} class="error-icon"></${iconExclamationMarkTag}>${errorTextTemplate}`,
    styles
})
class TestErrorPatternElement extends mixinErrorPattern(FoundationElement) {}

async function setup(): Promise<Fixture<TestErrorPatternElement>> {
    return await fixture(elementName);
}

describe('ErrorPatternMixin', () => {
    let element: TestErrorPatternElement;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: ErrorPatternPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new ErrorPatternPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults errorVisible to false', () => {
        expect(element.errorVisible).toBeFalse();
    });

    it('shows error icon when errorVisible is true', () => {
        element.errorVisible = true;
        processUpdates();
        expect(pageObject.isErrorIconVisible()).toBeTrue();
    });

    it('does not show error icon when errorVisible is false', () => {
        element.errorVisible = false;
        processUpdates();
        expect(pageObject.isErrorIconVisible()).toBeFalse();
    });

    it('defaults errorText to undefined', () => {
        expect(element.errorText).toBeUndefined();
    });

    it('shows error text when errorVisible is true', () => {
        const errorText = 'Something is wrong!';
        element.errorText = errorText;
        element.errorVisible = true;
        processUpdates();
        expect(pageObject.getDisplayedErrorText()).toBe(errorText);
    });

    it('does not show error text when errorVisible is false', () => {
        const errorText = 'Something is wrong!';
        element.errorText = errorText;
        element.errorVisible = false;
        processUpdates();
        expect(pageObject.getDisplayedErrorText()).toBe('');
    });

    describe('overflow behavior', () => {
        beforeEach(() => {
            element.style.display = 'block';
            element.style.width = '100px';
        });

        function setVisibleError(errorText: string): void {
            element.errorText = errorText;
            element.errorVisible = true;
            processUpdates();
        }

        it('sets title when error text is ellipsized', () => {
            const errorText = 'a very long error message because something terrible happened and we need to show the user what it is';
            setVisibleError(errorText);

            pageObject.dispatchEventToErrorText(new MouseEvent('mouseover'));
            expect(pageObject.getErrorTextTitle()).toBe(errorText);
        });

        it('does not set title when error text is fully visible', () => {
            setVisibleError('abc');

            pageObject.dispatchEventToErrorText(new MouseEvent('mouseover'));
            expect(pageObject.getErrorTextTitle()).toBe('');
        });

        it('removes title on mouseout of error text', () => {
            const errorText = 'a very long error message because something terrible happened and we need to show the user what it is';
            setVisibleError(errorText);

            pageObject.dispatchEventToErrorText(new MouseEvent('mouseover'));
            expect(pageObject.getErrorTextTitle()).toBe(errorText);

            pageObject.dispatchEventToErrorText(new MouseEvent('mouseout'));
            expect(pageObject.getErrorTextTitle()).toBe('');
        });
    });
});

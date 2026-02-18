import { css, customElement } from '@ni/fast-element';
import { FoundationElement } from '@ni/fast-foundation';
import {
    type Fixture,
    fixture,
    uniqueElementName
} from '../../../utilities/tests/fixture';
import { mixinSeverityPattern, Severity } from '../types';
import { styles } from '../styles';
import { severityTextTemplate } from '../template';
import { processUpdates } from '../../../testing/async-helpers';
import { SeverityPatternPageObject } from '../testing/severity-pattern.pageobject';

const elementName = uniqueElementName();
@customElement({
    name: elementName,
    template: severityTextTemplate,
    styles: css`${styles}`
})
class TestSeverityPattern extends mixinSeverityPattern(FoundationElement) {
    public override severity: Severity;
}

async function setup(): Promise<Fixture<TestSeverityPattern>> {
    return await fixture(elementName);
}

describe('SeverityPatternMixin', () => {
    let element: TestSeverityPattern;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: SeverityPatternPageObject;

    function setSeverity(severityText: string | undefined, severity: Severity): void {
        element.severityText = severityText;
        element.severity = severity;
        processUpdates();
    }

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
        pageObject = new SeverityPatternPageObject(element);
    });

    afterEach(async () => {
        await disconnect();
    });

    it('defaults severity to Severity.default to false', () => {
        expect(element.severity).toBe(Severity.default);
    });

    it('defaults severityText to undefined', () => {
        expect(element.severityText).toBeUndefined();
    });

    it('shows severity text when severity error', () => {
        const severityText = 'Something is wrong!';
        setSeverity(severityText, Severity.error);
        expect(pageObject.getDisplayedSeverityText()).toBe(severityText);
    });

    it('does not show severity text when severity default', () => {
        const severityText = 'Something is wrong!';
        setSeverity(severityText, Severity.default);
        expect(pageObject.getDisplayedSeverityText()).toBe('');
    });

    describe('overflow behavior', () => {
        beforeEach(() => {
            element.style.display = 'block';
            element.style.width = '100px';
        });

        it('sets title when error text is ellipsized', () => {
            const severityText = 'a very long error message because something terrible happened and we need to show the user what it is';
            setSeverity(severityText, Severity.error);

            pageObject.dispatchEventToSeverityText(new MouseEvent('mouseover'));
            expect(pageObject.getSeverityTextTitle()).toBe(severityText);
        });

        it('does not set title when error text is fully visible', () => {
            setSeverity('abc', Severity.error);

            pageObject.dispatchEventToSeverityText(new MouseEvent('mouseover'));
            expect(pageObject.getSeverityTextTitle()).toBe('');
        });

        it('removes title on mouseout of error text', () => {
            const errorText = 'a very long error message because something terrible happened and we need to show the user what it is';
            setSeverity(errorText, Severity.error);

            pageObject.dispatchEventToSeverityText(new MouseEvent('mouseover'));
            expect(pageObject.getSeverityTextTitle()).toBe(errorText);

            pageObject.dispatchEventToSeverityText(new MouseEvent('mouseout'));
            expect(pageObject.getSeverityTextTitle()).toBe('');
        });
    });
});

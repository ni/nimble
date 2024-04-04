import {
    DesignSystem, FoundationElement
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-calendar': Calendar;
    }
}

/**
 * A nimble-styled HTML button
 */
export class Calendar
    extends FoundationElement {
}

/**
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-calendar\>
 *
 */
const nimbleCalendar = Calendar.compose({
    baseName: 'calendar',
    baseClass: FoundationElement,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCalendar());
export const calendarTag = 'nimble-calendar';

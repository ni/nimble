import {
    DesignSystem,
    NumberField,
    NumberFieldOptions,
    numberFieldTemplate as template
} from '@microsoft/fast-foundation';
import {
    downArrow,
    upArrow
} from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { styles } from './styles';

/**
 * A function that returns a number-field registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-number-field\>
 *
 */
const coerceViewBox = (svgText: string): string => {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = svgText;
    const svg = templateElement.content.firstElementChild;
    const height = svg!.getAttribute('height') ?? '16';
    const width = svg!.getAttribute('width') ?? '16';
    svg!.setAttribute('viewBox', `0 0 ${height} ${width}`);
    svg!.removeAttribute('height');
    svg!.removeAttribute('width');
    const div = document.createElement('div');
    div.appendChild(templateElement.content);
    return div.innerHTML;
};

const nimbleNumberField = NumberField.compose<NumberFieldOptions>({
    baseName: 'number-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    },
    stepDownGlyph: `${coerceViewBox(downArrow.data)}`,
    stepUpGlyph: `${coerceViewBox(upArrow.data)}`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleNumberField());

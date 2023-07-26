import { DesignSystem } from '@microsoft/fast-foundation';
import { Mapping } from '../base';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-mapping-text': MappingText;
    }
}

/**
 * Maps data values to text.
 */
export class MappingText extends Mapping {}

const textMapping = MappingText.compose({
    baseName: 'mapping-text',
    template
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textMapping());
export const mappingTextTag = DesignSystem.tagFor(MappingText);

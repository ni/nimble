import { TextField as FoundationTextField, textFieldTemplate as template } from '@microsoft/fast-foundation';
import { textFieldStyles as styles } from '@microsoft/fast-components';

export const nimbleTextField = FoundationTextField.compose({
    // TODO figure out where 'fast-' prefix is being added in fast components. Looks like withPrefix is used, see:
    // https://github.com/microsoft/fast/blob/5e302d3593279a7ccdb354099aa9c30f82169e14/packages/web-components/fast-foundation/src/design-system/design-system.ts#L253
    baseName: 'nimble-text-field',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})

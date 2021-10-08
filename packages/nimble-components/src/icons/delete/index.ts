import { DesignSystem } from '@microsoft/fast-foundation';
import { delete16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { DeleteIcon };

/**
 * The icon component for the 'delete' icon
 */
class DeleteIcon extends Icon {
    public constructor() {
        super(delete16X16);
    }
}

/**
 * A function that returns a nimble-delete-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-delete-icon\>
 *
 */
const nimbleDeleteIcon = DeleteIcon.compose({
    baseName: 'delete-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDeleteIcon());

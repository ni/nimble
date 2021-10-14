import { DesignSystem } from '@microsoft/fast-foundation';
import { delete16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { DeleteIcon };
export const baseName = 'delete-icon';

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
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleDeleteIcon());

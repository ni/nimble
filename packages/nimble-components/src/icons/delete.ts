import { delete16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

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

registerIcon(baseName, DeleteIcon);

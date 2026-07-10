'use client';

import { FvCard, fvCardTag } from '@ni/ok-components/dist/esm/fv/card';
import {
    FvCardAppearance,
    FvCardInteractionMode
} from '@ni/ok-components/dist/esm/fv/card/types';
import { wrap } from '../../utilities/react-wrapper';

export { fvCardTag };
export { type FvCard, FvCardAppearance, FvCardInteractionMode };
export const OkFvCard = wrap(FvCard);
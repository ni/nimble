'use client';

import { FvContextHelp, fvContextHelpTag } from '@ni/ok-components/dist/esm/fv/context-help';
import type { FvContextHelpSeverity } from '@ni/ok-components/dist/esm/fv/context-help/types';
import { wrap } from '../../utilities/react-wrapper';

export { fvContextHelpTag };
export { type FvContextHelp, type FvContextHelpSeverity };
export const OkFvContextHelp = wrap(FvContextHelp);
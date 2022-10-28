import '@ni/nimble-components/dist/esm/button';
import type { Button } from '@ni/nimble-components/dist/esm/button';

import { setupCounter } from './counter';

setupCounter(document.querySelector<Button>('#counter')!);

import { Button } from '@ni/nimble-components/dist/esm/button';

import { setupCounter } from './counter';

setupCounter(document.querySelector<Button>('#counter')!);

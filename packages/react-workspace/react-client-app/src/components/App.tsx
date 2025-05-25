import { NimbleButton } from '@ni/nimble-react/dist/esm/button';
import { SprightRectangle } from '@ni/spright-react/dist/esm/rectangle';

import './App.scss';

export function App(): JSX.Element {
    return (
        <>
            <NimbleButton appearance='block'>Hello!</NimbleButton>
            <SprightRectangle>World!</SprightRectangle>
        </>
    );
}

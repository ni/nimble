import { useRef, useState } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleDrawer, type Drawer, DrawerUserDismissed, DrawerLocation, fromDrawerRef } from '@ni/nimble-react/drawer';
import { NimbleTextField } from '@ni/nimble-react/text-field';
import { NimbleSelect } from '@ni/nimble-react/select';
import { NimbleListOption } from '@ni/nimble-react/list-option';
import { SubContainer } from './SubContainer';

export function DrawerSection(): React.JSX.Element {
    const drawerRef = useRef<Drawer<string>>(null);
    const [drawerCloseReason, setDrawerCloseReason] = useState('');
    const [drawerLocation, setDrawerLocation] = useState<DrawerLocation>(DrawerLocation.right);

    function openDrawer(): void {
        void (async (): Promise<void> => {
            const closeReason = await drawerRef.current?.show();
            setDrawerCloseReason((closeReason === DrawerUserDismissed) ? 'escape pressed' : (closeReason ?? 'unknown'));
        })();
    }

    function closeDrawer(reason: string): void {
        drawerRef.current?.close(reason);
    }

    return (
        <SubContainer label="Drawer">
            <NimbleDrawer
                ref={fromDrawerRef(drawerRef)}
                location={drawerLocation}
            >
                <header>This is a drawer</header>
                <section>
                    <p style={{ height: '1000px' }}>It opened when you pushed the button</p>
                    <p>This is the bottom!</p>
                </section>
                <footer className="drawer-footer">
                    <NimbleButton appearance="ghost"
                        onClick={() => closeDrawer('cancel pressed')}
                    >Cancel</NimbleButton>
                    <NimbleButton
                        onClick={() => closeDrawer('OK pressed')}
                    >OK</NimbleButton>
                </footer>
            </NimbleDrawer>
            <NimbleButton
                onClick={openDrawer}
            >Open Drawer</NimbleButton>
            <NimbleTextField
                readOnly
                value={drawerCloseReason}
            >Closed Reason</NimbleTextField>
            <NimbleSelect className="drawer-location-select"
                value={drawerLocation}
                onChange={e => setDrawerLocation(e.target.value === DrawerLocation.left ? DrawerLocation.left : DrawerLocation.right)}
            >
                Drawer Location
                <NimbleListOption
                    value={DrawerLocation.left}
                >Drawer: Left-side</NimbleListOption>
                <NimbleListOption
                    value={DrawerLocation.right}
                >Drawer: Right-side</NimbleListOption>
            </NimbleSelect>
        </SubContainer>
    );
}

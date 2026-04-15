import { useRef, useState } from 'react';
import { NimbleButton } from '@ni/nimble-react/button';
import { NimbleDialog, type Dialog, DialogUserDismissed, fromDialogRef } from '@ni/nimble-react/dialog';
import { NimbleTextField } from '@ni/nimble-react/text-field';
import { SubContainer } from './SubContainer';

export function DialogSection(): React.JSX.Element {
    const dialogRef = useRef<Dialog<string>>(null);
    const [dialogCloseReason, setDialogCloseReason] = useState('');

    function openDialog(): void {
        void (async (): Promise<void> => {
            const closeReason = await dialogRef.current?.show();
            setDialogCloseReason((closeReason === DialogUserDismissed) ? 'escape pressed' : (closeReason ?? 'unknown'));
        })();
    }

    function closeDialog(reason: string): void {
        dialogRef.current?.close(reason);
    }

    return (
        <SubContainer label="Dialog">
            <NimbleDialog
                ref={fromDialogRef(dialogRef)}
            >
                <span slot="title">This is a dialog</span>
                <div>It opened when you pushed the button</div>
                <NimbleButton slot="footer"
                    onClick={_ => closeDialog('cancel pressed')}
                >Cancel</NimbleButton>
                <NimbleButton slot="footer"
                    onClick={_ => closeDialog('OK pressed')}
                >OK</NimbleButton>
            </NimbleDialog>
            <NimbleButton
                onClick={openDialog}
            >Open Dialog</NimbleButton>
            <NimbleTextField
                value={dialogCloseReason}
            >Closed Reason</NimbleTextField>
        </SubContainer>
    );
}

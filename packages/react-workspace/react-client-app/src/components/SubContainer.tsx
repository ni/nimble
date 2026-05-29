import type { ReactNode } from 'react';

interface SubContainerProp {
    label: string;
    children?: ReactNode;
}

export function SubContainer({ label, children }: SubContainerProp): React.JSX.Element {
    return (
        <>
            <div className="sub-container">
                <div className="container-label">{label}</div>
                <div>{children}</div>
            </div>
        </>
    );
}

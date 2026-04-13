import { useState } from 'react';
import { NimbleBanner } from '@ni/nimble-react/banner';
import { NimbleCheckbox } from '@ni/nimble-react/checkbox';
import { SubContainer } from './SubContainer';

export function BannerSection(): React.JSX.Element {
    const [bannerOpen, setBannerOpen] = useState(true);

    return (
        <SubContainer label="Banner">
            <NimbleBanner
                open={bannerOpen}
                onToggle={e => setBannerOpen(e.detail.newState)}
                severity="information">
                <span slot="title">Title of the banner</span>
                This is the message text of this banner. It tells you something interesting.
            </NimbleBanner>
            <NimbleCheckbox
                checked={bannerOpen}
                onChange={e => setBannerOpen(e.target.checked)}
            >Show banner</NimbleCheckbox>
        </SubContainer>
    );
}

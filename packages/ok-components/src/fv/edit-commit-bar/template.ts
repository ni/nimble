import { html, when } from '@ni/fast-element';
import { bannerTag } from '@ni/nimble-components/dist/esm/banner';
import type { BannerToggleEventDetail } from '@ni/nimble-components/dist/esm/banner/types';
import { buttonTag } from '@ni/nimble-components/dist/esm/button';
import { iconArrowPartialRotateLeftTag } from '@ni/nimble-components/dist/esm/icons/arrow-partial-rotate-left';
import { iconFloppyDiskTag } from '@ni/nimble-components/dist/esm/icons/floppy-disk';
import type { FvEditCommitBar } from '.';

export const template = html<FvEditCommitBar>`
    ${when(
        x => x.message !== undefined,
        html<FvEditCommitBar>`
            <${bannerTag}
                open
                title-hidden
                severity="${x => x.message?.severity}"
                aria-live="${x => (x.message?.severity === 'error' ? 'assertive' : 'polite')}"
                @toggle="${(x, c) => x.handleBannerToggle(c.event as CustomEvent<BannerToggleEventDetail>)}"
            >${x => x.message?.text}</${bannerTag}>
        `
    )}
    <div class="bar">
        <div class="text">
            <div class="heading">
                <h2>${x => x.heading}</h2>
                <slot name="heading-actions"></slot>
            </div>
            ${when(
                x => !x.hideEmptySummary || x.changeCount > 0,
                html<FvEditCommitBar>`
                    <div class="summary" role="status" aria-live="polite" aria-atomic="true">
                        ${x => x.summary}
                    </div>
                `
            )}
        </div>
        ${when(
            x => !x.actionsHidden,
            html<FvEditCommitBar>`
                <div class="actions">
                    <${buttonTag}
                        appearance="ghost"
                        ?disabled="${x => x.revertDisabled}"
                        @click="${x => x.revert()}"
                    ><${iconArrowPartialRotateLeftTag} slot="start"></${iconArrowPartialRotateLeftTag}>Revert</${buttonTag}>
                    <${buttonTag}
                        appearance="block"
                        appearance-variant="accent"
                        ?disabled="${x => x.saveDisabled}"
                        @click="${x => x.save()}"
                    ><${iconFloppyDiskTag} slot="start"></${iconFloppyDiskTag}>Save</${buttonTag}>
                </div>
            `
        )}
    </div>
`;

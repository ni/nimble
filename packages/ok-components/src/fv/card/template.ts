import { html, when } from '@ni/fast-element';
import { cardTag } from '@ni/nimble-components/dist/esm/card';
import { cardButtonTag } from '@ni/nimble-components/dist/esm/card-button';
import { FvCardInteractionMode } from './types';
import type { FvCard } from '.';

const cardContentTemplate = html<FvCard>`
    <div class="card-layout ${x => x.hasMedia ? 'has-media' : 'no-media'}">
        ${when(
            x => x.hasMedia,
            html<FvCard>`
                <div class="media-region" part="media-region">
                    ${when(
                        x => x.showInitials,
                        html<FvCard>`
                            <div class="initials-tile" part="initials-tile" aria-hidden="true">
                                ${x => x.initialsText}
                            </div>
                        `
                    )}
                    <slot
                        name="icon"
                        @slotchange="${(x, c) => x.handleIconSlotChange(c.event)}"
                    ></slot>
                </div>
            `
        )}
        <div class="main-region" part="main-region">
            <div class="header-row" part="header-row">
                <div class="title-group" part="title-group">
                    <div class="title" part="title">${x => x.title}</div>
                    ${when(
                        x => x.subtitle.length > 0,
                        html<FvCard>`
                            <div class="subtitle" part="subtitle">${x => x.subtitle}</div>
                        `
                    )}
                </div>
                ${when(
                    x => x.hasBadgesContent,
                    html<FvCard>`
                        <div class="badges" part="badges">
                            <slot
                                name="badges"
                                @slotchange="${(x, c) => x.handleBadgesSlotChange(c.event)}"
                            ></slot>
                        </div>
                    `
                )}
                ${when(
                    x => !x.hasBadgesContent,
                    html<FvCard>`
                        <slot
                            name="badges"
                            hidden
                            @slotchange="${(x, c) => x.handleBadgesSlotChange(c.event)}"
                        ></slot>
                    `
                )}
            </div>
            ${when(
                x => x.showBody,
                html<FvCard>`
                    <div class="body" part="body">
                        ${when(
                            x => x.description.length > 0,
                            html<FvCard>`
                                <div class="description" part="description">${x => x.description}</div>
                            `
                        )}
                        <slot
                            @slotchange="${(x, c) => x.handleDefaultSlotChange(c.event)}"
                        ></slot>
                    </div>
                `
            )}
            ${when(
                x => !x.showBody,
                html<FvCard>`
                    <slot
                        hidden
                        @slotchange="${(x, c) => x.handleDefaultSlotChange(c.event)}"
                    ></slot>
                `
            )}
            ${when(
                x => x.showFooter,
                html<FvCard>`
                    <div class="footer" part="footer">
                        <div class="footer-start" part="footer-start">
                            <slot
                                name="footer-start"
                                @slotchange="${(x, c) => x.handleFooterStartSlotChange(c.event)}"
                            ></slot>
                        </div>
                        <div class="footer-end" part="footer-end">
                            <slot
                                name="footer-end"
                                @slotchange="${(x, c) => x.handleFooterEndSlotChange(c.event)}"
                            ></slot>
                        </div>
                    </div>
                `
            )}
            ${when(
                x => !x.showFooter,
                html<FvCard>`
                    <slot
                        name="footer-start"
                        hidden
                        @slotchange="${(x, c) => x.handleFooterStartSlotChange(c.event)}"
                    ></slot>
                    <slot
                        name="footer-end"
                        hidden
                        @slotchange="${(x, c) => x.handleFooterEndSlotChange(c.event)}"
                    ></slot>
                `
            )}
            ${when(
                x => x.showActions,
                html<FvCard>`
                    <div class="actions" part="actions">
                        <slot
                            name="actions"
                            @slotchange="${(x, c) => x.handleActionsSlotChange(c.event)}"
                        ></slot>
                    </div>
                `
            )}
            ${when(
                x => !x.showActions,
                html<FvCard>`
                    <slot
                        name="actions"
                        hidden
                        @slotchange="${(x, c) => x.handleActionsSlotChange(c.event)}"
                    ></slot>
                `
            )}
        </div>
    </div>
`;

export const template = html<FvCard>`
    ${when(
        x => x.interactionMode === FvCardInteractionMode.card,
        html<FvCard>`
            <${cardButtonTag}
                class="card-shell card-button-shell"
                part="card-shell"
                ?disabled="${x => x.disabled}"
            >
                <div class="card-button-content">
                    ${cardContentTemplate}
                </div>
            </${cardButtonTag}>
        `,
        html<FvCard>`
            <${cardTag}
                class="card-shell card-static-shell"
                part="card-shell"
            >
                ${cardContentTemplate}
            </${cardTag}>
        `
    )}
`;

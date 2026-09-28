import { html, when, type ViewTemplate } from '@ni/fast-element';
import { iconCircleCheckTag } from '@ni/nimble-components/dist/esm/icons/circle-check';
import { iconCircleSlashTag } from '@ni/nimble-components/dist/esm/icons/circle-slash';
import { iconExclamationMarkTag } from '@ni/nimble-components/dist/esm/icons/exclamation-mark';
import { iconQuestionTag } from '@ni/nimble-components/dist/esm/icons/question';
import { iconStopSquareTag } from '@ni/nimble-components/dist/esm/icons/stop-square';
import { iconTriangleFilledTag } from '@ni/nimble-components/dist/esm/icons/triangle-filled';
import { spinnerTag } from '@ni/nimble-components/dist/esm/spinner';
import { ChatToolCallStatus } from './types';

interface StatusSource {
    normalizedStatus: ChatToolCallStatus;
}

/** @internal */
export const statusIconTemplate: ViewTemplate<StatusSource> = html<StatusSource>`
    ${when(x => x.normalizedStatus === ChatToolCallStatus.pending, html`
        <${spinnerTag} aria-hidden="true"></${spinnerTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.success, html`
        <${iconCircleCheckTag} aria-hidden="true"></${iconCircleCheckTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.warning, html`
        <${iconTriangleFilledTag} aria-hidden="true"></${iconTriangleFilledTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.error, html`
        <${iconExclamationMarkTag} aria-hidden="true"></${iconExclamationMarkTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.canceled || x.normalizedStatus === ChatToolCallStatus.declined, html`
        <${iconCircleSlashTag} aria-hidden="true"></${iconCircleSlashTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.terminated, html`
        <${iconStopSquareTag} aria-hidden="true"></${iconStopSquareTag}>
    `)}
    ${when(x => x.normalizedStatus === ChatToolCallStatus.unknown, html`
        <${iconQuestionTag} aria-hidden="true"></${iconQuestionTag}>
    `)}
`;
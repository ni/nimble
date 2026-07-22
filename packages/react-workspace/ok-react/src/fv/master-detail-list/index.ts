'use client';

import {
    FvMasterDetailList,
    fvMasterDetailListTag,
    type FvMasterDetailListChangeDetail
} from '@ni/ok-components/dist/esm/fv/master-detail-list';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { fvMasterDetailListTag };
export { type FvMasterDetailList, type FvMasterDetailListChangeDetail };
export const OkFvMasterDetailList = wrap(FvMasterDetailList, {
    events: {
        onChange: 'change' as EventName<FvMasterDetailListChangeEvent>,
    }
});
export interface FvMasterDetailListChangeEvent extends CustomEvent<FvMasterDetailListChangeDetail> {
    target: FvMasterDetailList;
}
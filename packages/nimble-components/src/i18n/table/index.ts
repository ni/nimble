import { DesignToken, DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { InternationalizationBase } from '../i18n-base';
import { styles } from '../styles';
import { template } from '../template';

const tableGroupsCollapseAllLabelDefault = 'Collapse all groups' as const;

export const tableGroupsCollapseAllLabel = DesignToken.create<string>({
    name: 'table-groups-collapse-all',
    cssCustomPropertyName: null
}).withDefault(tableGroupsCollapseAllLabelDefault);

/**
 * i18n provider: Table (NimbleTable related strings)
 */
export class InternationalizationTable extends InternationalizationBase {
    @attr({
        attribute: 'table-groups-collapse-all',
        mode: 'fromView'
    })
    public tableGroupsCollapseAll: string = tableGroupsCollapseAllLabelDefault;

    protected tableGroupsCollapseAllChanged(_prev: string | undefined, next: string | undefined): void {
        this.handleTokenChanged(tableGroupsCollapseAllLabel, next);
    }
}

const nimbleInternationalizationTable = InternationalizationTable.compose({
    baseName: 'i18n-table',
    styles,
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleInternationalizationTable());
export const i18nTableTag = DesignSystem.tagFor(InternationalizationTable);

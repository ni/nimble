/* eslint-disable max-classes-per-file */
import { attr, css, customElement, html, ViewTemplate } from '@microsoft/fast-element';

import { TableCellView } from '../../../../nimble-components/src/table-column/base/cell-view';
import { TableColumn } from '../../../../nimble-components/src/table-column/base';
import { template } from '../../../../nimble-components/src/table-column/base/template';
import type { TableStringField } from '../../../../nimble-components/src/table/types';
import type { ColumnInternalsOptions } from '../../../../nimble-components/src/table-column/base/models/column-internals';
import { ColumnValidator } from '../../../../nimble-components/src/table-column/base/models/column-validator';
import { tooltipTag } from '../../../../nimble-components/src/tooltip';
import { display } from '../../../../nimble-components/src/utilities/style/display';
import {
    tokenNames as tokens,
    suffixFromTokenName,
    cssPropertyFromTokenName,
    TokenSuffix
} from '../../../../nimble-components/src/theme-provider/design-token-names';

type TokenName = keyof typeof tokens;

const computedCSSValueFromTokenName = (tokenName: string): string => {
    return getComputedStyle(document.documentElement).getPropertyValue(
        cssPropertyFromTokenName(tokenName)
    );
};

const colorTemplate = html<TableColumnDesignTokenCellView>`
    <div
        title="${x => computedCSSValueFromTokenName(tokens[x.tokenName])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: var(${x => cssPropertyFromTokenName(tokens[x.tokenName])});
    "
    ></div>
`;

const rgbColorTemplate = html<TableColumnDesignTokenCellView>`
    <div
        title="${x => computedCSSValueFromTokenName(tokens[x.tokenName])}"
        style="
        display: inline-block;
        height: 24px;
        width: 24px;
        border: 1px solid black;
        background-color: rgba(var(${x => cssPropertyFromTokenName(tokens[x.tokenName])}), 1.0);
    "
    ></div>
`;

const stringValueTemplate = html<TableColumnDesignTokenCellView>`
    <div style="display: inline-block;">
        ${x => computedCSSValueFromTokenName(tokens[x.tokenName])}
    </div>
`;

const fontTemplate = html<TableColumnDesignTokenCellView>`
    <div
        style="
        display: inline-block;
        font: var(${x => cssPropertyFromTokenName(tokens[x.tokenName])});
    "
    >
        Nimble
    </div>
`;

const errorTemplate = html<TableColumnDesignTokenCellView>`error ${x => x.tokenName}`;

/* eslint-disable @typescript-eslint/naming-convention */
const tokenTemplates: {
    readonly [key in TokenSuffix]: ViewTemplate<TableColumnDesignTokenCellView>;
} = {
    Color: colorTemplate,
    RgbPartialColor: rgbColorTemplate,
    DisabledFontColor: colorTemplate,
    FontColor: colorTemplate,
    FontLineHeight: stringValueTemplate,
    FontWeight: stringValueTemplate,
    FontSize: stringValueTemplate,
    TextTransform: stringValueTemplate,
    FontFamily: stringValueTemplate,
    BoxShadow: stringValueTemplate,
    MaxHeight: stringValueTemplate,
    MinWidth: stringValueTemplate,
    Font: fontTemplate,
    Size: stringValueTemplate,
    Width: stringValueTemplate,
    Height: stringValueTemplate,
    Delay: stringValueTemplate,
    Padding: stringValueTemplate
};
/* eslint-enable @typescript-eslint/naming-convention */

type TableColumnDesignTokenCellRecord = TableStringField<'value'>;
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TableColumnDesignTokenColumnConfig {}

const tableColumnDesignTokenCellViewTag = 'nimble-table-column-design-token-cell-view';
/**
 * Design Token Cell View
 */
@customElement({
    name: tableColumnDesignTokenCellViewTag,
    template: html<TableColumnDesignTokenCellView>`
        <span
            id="content"
            style="align-self:normal;"
        >
            ${x => x.updateContentTemplate()}
        </span>
        <${tooltipTag}
            anchor="content"
        >
            ${x => x.cellRecord?.value}
        </${tooltipTag}>
    `,
    styles: css`
        ${display('flex')}
        :host {
            align-items: center;
        }
    `
})
class TableColumnDesignTokenCellView extends TableCellView<TableColumnDesignTokenCellRecord, TableColumnDesignTokenColumnConfig> {
    public updateContentTemplate(): ViewTemplate<TableColumnDesignTokenCellView> {
        const suffix = suffixFromTokenName(this.cellRecord?.value ?? '');
        if (!suffix) {
            return errorTemplate;
        }
        return tokenTemplates[suffix];
    }

    public get tokenName(): TokenName {
        return this.cellRecord!.value as TokenName;
    }
}
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDesignTokenCellViewTag]: TableColumnDesignTokenCellView;
    }
}

export const tableColumnDesignTokenTag = 'nimble-table-column-design-token';
/**
 * Simple empty table column for testing
 */
@customElement({
    name: tableColumnDesignTokenTag,
    template
})
class TableColumnDesignToken extends TableColumn {
    @attr({ attribute: 'field-name' })
    public fieldName?: string;

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnDesignTokenCellViewTag,
            delegatedEvents: [],
            validator: new ColumnValidator<[]>([])
        };
    }

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName];
    }
}
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnDesignTokenTag]: TableColumnDesignToken;
    }
}

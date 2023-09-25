# File Size Table Column

## Overview

The file size table column will provide a way to visualize numeric data that represents a file size (or other binary data size). It will automatically convert the raw value to use an appropriate display unit.

### Background

[Work Item](https://ni.visualstudio.com/DevCentral/_workitems/edit/2526114)

### Non-goals

-   Configurable number of decimal places
-   Configurable units (e.g. display all values in KB)
-   Grouping by value ranges/buckets

### Features

-   Converts the byte value to largest unit (e.g. KB, MB, GB) that results in a value of >=1
-   Option to use 1024-based units (e.g. KiB) or 1000-based units (e.g. KB)
-   Displays up to one decimal place
-   Sorts/groups by numeric value (number of bytes) rather than display string
-   Localized number and unit strings

### Risks and Challenges

### Prior Art/Examples

Size column in [SLE Files grid](https://dev.lifecyclesolutions.ni.com/files/)

Windows explorer (details view)

---

## Design

Below is an example of how the `nimble-table-column-file-size` would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-file-size field-name="size">Size</nimble-table-column-file-size>
</nimble-table>
```

### API

`nimble-table-column-file-size`

-   `field-name` - name of the record field containing the data. Data must be a `number` byte count.
-   `unit-type` - "binary" (KiB, MiB, GiB, TiB, PiB) or "decimal" (KB, MB, GB, TB, PB); defaults to "decimal"

The component will extend `TableColumnTextBase`, thereby including the APIs for a **groupable** and **fractional-width** column.

### Anatomy

### Angular integration

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component.

### Visual Appearance

Will use same text styling as the `nimble-table-column-text`.

## Implementation

```ts
class TableColumnFileSize extends TableColumnTextBase {
    @attr({ attribute: 'unit-type' })
    public unitType: FileSizeUnitType;

    // Subscribes to changes in the lang design token, so
    // that it can update the format as needed.
    private readonly langSubscriber: DesignTokenSubscriber<typeof lang> = {
        handleChange: () => {
            this.updateColumnConfig();
        }
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        lang.subscribe(this.langSubscriber, this);
        this.updateColumnConfig();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        lang.unsubscribe(this.langSubscriber, this);
    }

    public unitTypeChanged(): void {
        this.updateColumnConfig();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnFileSizeCellViewTag,
            groupHeaderViewTag: tableColumnFileSizeGroupHeaderViewTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    private updateColumnConfig(): void {
        const columnConfig: TableColumnFileSizeColumnConfig = {
            formatter: this.createFormatter(),
            unitStrings: getFileSizeUnitArray(
                this.unitType,
                lang.getValueFor(this)
            ),
            unitType: this.unitType
        };
        this.columnInternals.columnConfig = columnConfig;
    }

    private createFormatter(): Intl.NumberFormat {
        return new Intl.NumberFormat(lang.getValueFor(this), {
            maximumFractionDigits: 1,
            minimumFractionDigits: 0,
            useGrouping: true
        });
    }
}
```

Cell view will extend `TableColumnTextCellViewBase` and use its template.

```ts
class TableColumnFileSizeCellView extends TableColumnTextCellViewBase<
    TableColumnFileSizeCellRecord,
    TableColumnFileSizeColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private cellRecordChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        if (this.columnConfig) {
            this.text = formatFileSize(
                this.columnConfig.formatter, // instance of Intl.NumberFormat
                this.unitStrings, // either ['byte', 'bytes', 'KB', ...] or ['byte', 'bytes', 'KiB', ...]
                this.columnConfig.unitType,
                this.cellRecord?.value
            );
        } else {
            this.text = '';
        }
    }
}

// Shared function also used by group header view
function formatFileSize(
    formatter: Intl.NumberFormat,
    unitStrings: string[],
    unitType: FileSizeUnitType,
    byteCount: number
): string {
    let currentSize = byteCount;
    let unitIndex = 0;
    if (currentSize !== 1) {
        const divisor = unitType === FileSizeUnitType.binary ? 1024 : 1000;
        while (currentSize >= divisor && unitIndex < unitStrings.length) {
            currentSize /= divisor;
            unitIndex += 1;
        }
    }

    return `${formatter.format(currentSize)} ${unitStrings[unitIndex]}`;
}
```

Group header view will extend `TableColumnTextGroupHeaderViewBase` and use its template.

```ts
class TableColumnFileSizeGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
    TableNumberFieldValue,
    TableColumnFileSizeColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private groupHeaderValueChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        if (this.columnConfig) {
            this.text = formatFileSize(
                this.columnConfig.formatter,
                this.unitStrings,
                this.columnConfig.unitType,
                this.cellRecord?.value
            );
        } else {
            this.text = '';
        }
    }
}
```

### States

N/A

### Accessibility

Accessibility of the cells rendered using the `nimble-table-column-file-size` are handled via the [`nimble-table-cell`](https://github.com/ni/nimble/blob/f663c38741e731bef91aa58e8fb2d1cec653b679/packages/nimble-components/src/table/components/cell/template.ts#L6) which has a `role` of [`cell`](https://w3c.github.io/aria/#cell).

### Mobile

N/A

### Globalization

#### Localization of the number

For this we will use `Intl.NumberFormat`, passing in the value of the `lang` design token as the locale.

#### Localization of the unit label

This is more difficult, as there does not seem to be any API for getting a file size unit string for a given locale. Options:

1. Find translations of each of our unit labels ("byte", "bytes", "KB", "MB", "GB", "TB", "PB", "KiB", "MiB", "GiB", "TiB", "PiB") for a fixed set of languages we wish to support. Maintain a mapping of language codes (e.g. "fr", "de", "zh_CN") to arrays of those localized unit labels. Given a locale to use, look up its language subtag in our map. If not found, fall back to English.

**Pros:** No work for clients.

**Cons:** Only supports a fixed set of languages. Up to us to find accurate translations. Unsure if subtags other than the language (e.g. region) could be relevant to the translation.

2. Use Nimble label provider. Add label tokens for the units, and rely on clients to provide translations.

**Pros:** Supports any language a client cares to provide translations for.

**Cons:** Less convenient for clients. Does not honor the `lang` setting on the page or on `nimble-theme-provider`.

I suggest we go with option 1, primarily because I am hesitant to add twelve new label provider strings that clients are expected to localize. I suggest initially supporting the following languages:

-   English ('en')
-   German ('de')
-   Spanish ('es')
-   French ('fr')
-   Italian ('it')
-   Hebrew ('iw' or 'he')
-   Russian ('ru')
-   Turkish ('tr')
-   Japanese ('ja')
-   Chinese - simplified ('zh_CN')
-   Chinese - traditional ('zh_TW')

### Security

N/A

### Performance

N/A

### Dependencies

None

### Test Plan

Unit tests:

-   standard component tests
-   renders blank for invalid input values: `Inf`, `-Inf`, `NaN`, and non-number
-   for an interesting range of values, value conversion results in correct values and units (using English `lang`)
-   correct units used for both `unit-type`s
-   standard cell text/group header text ellipsizing tests
-   honors `lang` value and responds to changes to `lang` value
-   uses English labels when unsupported locale is given

### Tooling

N/A

### Documentation

This component will be documented via a new story in Storybook.

---

## Open Issues

-   Is there a better name for this column type? E.g. `nimble-table-column-memory-size`.

import { slotted, html } from '@microsoft/fast-element';
import { template as baseTemplate } from '../base/template';
import type { TableColumnEnumBase, TableColumnEnumColumnConfig } from '.';
import type { TableColumnEnumBaseValidator } from './models/table-column-enum-base-validator';

export const template = html<
TableColumnEnumBase<
TableColumnEnumColumnConfig,
TableColumnEnumBaseValidator<[]>
>
>`${baseTemplate}<slot ${slotted('mappings')} name="mapping"></slot>`;

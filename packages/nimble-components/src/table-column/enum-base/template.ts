import { slotted, html } from '@microsoft/fast-element';
import { template as baseTemplate } from '../base/template';
import type { TableColumnEnumBase, TableColumnEnumColumnConfig } from '.';

export const template = html<
TableColumnEnumBase<
TableColumnEnumColumnConfig
>
>`${baseTemplate}<slot ${slotted('mappings')} name="mapping"></slot>`;

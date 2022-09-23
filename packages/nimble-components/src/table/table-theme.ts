import { css } from '@microsoft/fast-element';

export const tableTheme = css`
    perspective-viewer,
    perspective-viewer[theme='Material Light'] {
        --theme-name: 'Material Light';
    }
    perspective-viewer[theme='Material Light'],
    .perspective-viewer-material {
        --button--font-size: 16px;
        --config-button--padding: 15px 8px 6px 8px;
        --column-drop-label--font-size: 8px;
        --column-drop-container--padding: 0px;
        --column-drop-label--display: inline-block;
        --column-selector--width: 24px;
        --column-selector--font-size: 16px;
        --column_type--width: 25px;
        --select--padding: 0px;
        --side-panel--padding: 12px 0px 6px 8px;
        --top-panel--padding: 0px 0px 12px 0px;
        --top-panel-row--display: inline-flex;
        color: #161616;
        background-color: #f2f4f6;
        --active--color: #2670a9;
        --error--color: #ff471e;
        --plugin--background: #ffffff;
        --overflow-hint-icon--color: rgba(0, 0, 0, 0.2);
        --select--background-color: none;
        --column-drop-container--background: none;
        --float--column-type--color: #2670a9;
        --string--column-type--color: #e32b16;
        --date--column-type--color: #24874b;
        --boolean--column-type--color: #ea7319;
        font-family: 'Open Sans';
        --preload-fonts: 'Roboto Mono:200;Open Sans:300,400;Material Icons:400';
        --interface-monospace--font-family: 'Roboto Mono';
        --button--font-family: 'Material Icons';
        --group_by--content: 'Group By';
        --split_by--content: 'Split By';
        --inactive-column-selector--content: '\e835';
        --active-column-selector--content: '\e834';
        --config-button-icon--content: 'more_vert';
        --overflow-hint-icon--content: 'error_outline';
        --status-icon--content: 'circle';
        --status-bar-counter--content: 'arrow_back';
        --reset-button-icon--content: 'refresh';
        --export-button-icon--content: 'download';
        --copy-button-icon--content: 'content_copy';
        --save-button-icon--content: 'save';
        --theme-button-icon--content: 'palette';
        --transpose-button--content: 'swap_horiz';
        --sort-order-asc--content: 'arrow_upward';
        --sort-order-desc--content: 'arrow_downward';
        --sort-order-none--content: 'remove';
        --sort-order-col-asc--content: 'arrow_forward';
        --sort-order-col-desc--content: 'arrow_back';
        --column-add--content: 'add';
        --column-menu--content: 'menu';
        --column-close--content: 'close';
        --d3fc-y1-label--content: 'arrow_upward';
        --d3fc-y2-label--content: 'arrow_downward';
        --d3fc-treedata-axis--lines: none;
        --d3fc-tooltip--background--color: rgba(155, 155, 155, 0.8);
        --d3fc-tooltip--color: #161616;
        --d3fc-tooltip--border-color: #fff;
        --d3fc-tooltip--box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        --d3fc-gridline--color: #eaedef;
        --d3fc-axis-ticks--color: #161616;
        --d3fc-axis--lines: #c5c9d0;
        --d3fc-legend--background: rgba(255, 255, 255, 0.8);
        --d3fc-series: rgba(31, 119, 180, 0.8);
        --d3fc-series-1: #0366d6;
        --d3fc-series-2: #ff7f0e;
        --d3fc-series-3: #2ca02c;
        --d3fc-series-4: #d62728;
        --d3fc-series-5: #9467bd;
        --d3fc-series-6: #8c564b;
        --d3fc-series-7: #e377c2;
        --d3fc-series-8: #7f7f7f;
        --d3fc-series-9: #bcbd22;
        --d3fc-series-10: #17becf;
        --d3fc-full--gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 22.5%,
            #feeb65 42.5%,
            #f0f0f0 50%,
            #dcedc8 57.5%,
            #42b3d5 67.5%,
            #1a237e 100%
        );
        --d3fc-positive--gradient: linear-gradient(
            #f0f0f0 0%,
            #dcedc8 10%,
            #42b3d5 50%,
            #1a237e 100%
        );
        --d3fc-negative--gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 50%,
            #feeb65 90%,
            #f0f0f0 100%
        );
        --rt-pos-cell--color: #338dcd;
        --rt-neg-cell--color: #ff471e;
        --column-style-open-button--content: 'menu';
        --column-style-close-button--content: 'expand_less';
        --tree-label-collapse--content: 'remove';
        --tree-label-expand--content: 'add';
        --toolbar-scroll-lock--content: 'lock_open';
        --toolbar-scroll-lock-active--content: 'lock';
        --toolbar-edit-mode--content: 'edit_off';
        --toolbar-edit-mode-active--content: 'edit';
        --map-tile-url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
        --map-element-background: #fff;
        --map-category-1: #0366d6;
        --map-category-2: #ff7f0e;
        --map-category-3: #2ca02c;
        --map-category-4: #d62728;
        --map-category-5: #9467bd;
        --map-category-6: #8c564b;
        --map-category-7: #e377c2;
        --map-category-8: #7f7f7f;
        --map-category-9: #bcbd22;
        --map-category-10: #17becf;
        --map-gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 22.5%,
            #feeb65 42.5%,
            #f0f0f0 50%,
            #dcedc8 57.5%,
            #42b3d5 67.5%,
            #1a237e 100%
        );
    }
    perspective-viewer[theme='Material Light']
        regular-table::-webkit-scrollbar-thumb,
    .perspective-viewer-material regular-table::-webkit-scrollbar-thumb {
        background-color: transparent;
    }
    perspective-viewer[theme='Material Light']
        regular-table:hover::-webkit-scrollbar-thumb,
    .perspective-viewer-material regular-table:hover::-webkit-scrollbar-thumb {
        background-color: #e0e4e9;
    }
    perspective-copy-menu[theme='Material Light'],
    perspective-export-menu[theme='Material Light'],
    perspective-filter-dropdown[theme='Material Light'],
    perspective-date-column-style[theme='Material Light'],
    perspective-datetime-column-style[theme='Material Light'],
    perspective-number-column-style[theme='Material Light'],
    perspective-string-column-style[theme='Material Light'],
    perspective-expression-editor[theme='Material Light'],
    .perspective-modal-material {
        font-family: 'Open Sans';
        --preload-fonts: 'Roboto Mono:200;Open Sans:300,400;Material Icons:400';
        --interface-monospace--font-family: 'Roboto Mono';
        --button--font-family: 'Material Icons';
        color: #161616;
        background-color: #f2f4f6;
        --active--color: #2670a9;
        --error--color: #ff471e;
        --plugin--background: #ffffff;
        --overflow-hint-icon--color: rgba(0, 0, 0, 0.2);
        --select--background-color: none;
        --column-drop-container--background: none;
        --float--column-type--color: #2670a9;
        --string--column-type--color: #e32b16;
        --date--column-type--color: #24874b;
        --boolean--column-type--color: #ea7319;
        background-color: #fff;
        --column-style-pos-color--content: 'add';
        --column-style-neg-color--content: 'remove';
        --save-button-icon--content: 'save';
        --reset-button-icon--content: 'refresh';
        --column-style-radio--appearance: none;
        --column-style-radio-checked--content: 'radio_button_checked';
        --column-style-radio-unchecked--content: 'radio_button_unchecked';
        --column-style-checkbox--appearance: none;
        --column-style-checkbox-checked--content: 'check_box';
        --column-style-checkbox-unchecked--content: 'check_box_outline_blank';
    }
    .perspective-viewer-material--dimensions {
        --button--font-size: 16px;
        --config-button--padding: 15px 8px 6px 8px;
        --column-drop-label--font-size: 8px;
        --column-drop-container--padding: 0px;
        --column-drop-label--display: inline-block;
        --column-selector--width: 24px;
        --column-selector--font-size: 16px;
        --column_type--width: 25px;
        --select--padding: 0px;
        --side-panel--padding: 12px 0px 6px 8px;
        --top-panel--padding: 0px 0px 12px 0px;
        --top-panel-row--display: inline-flex;
    }
    .perspective-viewer-material--colors {
        color: #161616;
        background-color: #f2f4f6;
        --active--color: #2670a9;
        --error--color: #ff471e;
        --plugin--background: #ffffff;
        --overflow-hint-icon--color: rgba(0, 0, 0, 0.2);
        --select--background-color: none;
        --column-drop-container--background: none;
        --float--column-type--color: #2670a9;
        --string--column-type--color: #e32b16;
        --date--column-type--color: #24874b;
        --boolean--column-type--color: #ea7319;
    }
    .perspective-viewer-material--fonts {
        font-family: 'Open Sans';
        --preload-fonts: 'Roboto Mono:200;Open Sans:300,400;Material Icons:400';
        --interface-monospace--font-family: 'Roboto Mono';
        --button--font-family: 'Material Icons';
    }
    .perspective-viewer-material--intl {
        --group_by--content: 'Group By';
        --split_by--content: 'Split By';
        --inactive-column-selector--content: '\e835';
        --active-column-selector--content: '\e834';
        --config-button-icon--content: 'more_vert';
        --overflow-hint-icon--content: 'error_outline';
        --status-icon--content: 'circle';
        --status-bar-counter--content: 'arrow_back';
        --reset-button-icon--content: 'refresh';
        --export-button-icon--content: 'download';
        --copy-button-icon--content: 'content_copy';
        --save-button-icon--content: 'save';
        --theme-button-icon--content: 'palette';
        --transpose-button--content: 'swap_horiz';
        --sort-order-asc--content: 'arrow_upward';
        --sort-order-desc--content: 'arrow_downward';
        --sort-order-none--content: 'remove';
        --sort-order-col-asc--content: 'arrow_forward';
        --sort-order-col-desc--content: 'arrow_back';
        --column-add--content: 'add';
        --column-menu--content: 'menu';
        --column-close--content: 'close';
    }
    .perspective-viewer-material--d3fc {
        --d3fc-y1-label--content: 'arrow_upward';
        --d3fc-y2-label--content: 'arrow_downward';
        --d3fc-treedata-axis--lines: none;
        --d3fc-tooltip--background--color: rgba(155, 155, 155, 0.8);
        --d3fc-tooltip--color: #161616;
        --d3fc-tooltip--border-color: #fff;
        --d3fc-tooltip--box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        --d3fc-gridline--color: #eaedef;
        --d3fc-axis-ticks--color: #161616;
        --d3fc-axis--lines: #c5c9d0;
        --d3fc-legend--background: rgba(255, 255, 255, 0.8);
        --d3fc-series: rgba(31, 119, 180, 0.8);
        --d3fc-series-1: #0366d6;
        --d3fc-series-2: #ff7f0e;
        --d3fc-series-3: #2ca02c;
        --d3fc-series-4: #d62728;
        --d3fc-series-5: #9467bd;
        --d3fc-series-6: #8c564b;
        --d3fc-series-7: #e377c2;
        --d3fc-series-8: #7f7f7f;
        --d3fc-series-9: #bcbd22;
        --d3fc-series-10: #17becf;
        --d3fc-full--gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 22.5%,
            #feeb65 42.5%,
            #f0f0f0 50%,
            #dcedc8 57.5%,
            #42b3d5 67.5%,
            #1a237e 100%
        );
        --d3fc-positive--gradient: linear-gradient(
            #f0f0f0 0%,
            #dcedc8 10%,
            #42b3d5 50%,
            #1a237e 100%
        );
        --d3fc-negative--gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 50%,
            #feeb65 90%,
            #f0f0f0 100%
        );
    }
    .perspective-viewer-material--openlayers {
        --map-tile-url: 'http://{a-c}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
        --map-element-background: #fff;
        --map-category-1: #0366d6;
        --map-category-2: #ff7f0e;
        --map-category-3: #2ca02c;
        --map-category-4: #d62728;
        --map-category-5: #9467bd;
        --map-category-6: #8c564b;
        --map-category-7: #e377c2;
        --map-category-8: #7f7f7f;
        --map-category-9: #bcbd22;
        --map-category-10: #17becf;
        --map-gradient: linear-gradient(
            #4d342f 0%,
            #e4521b 22.5%,
            #feeb65 42.5%,
            #f0f0f0 50%,
            #dcedc8 57.5%,
            #42b3d5 67.5%,
            #1a237e 100%
        );
    }
    .perspective-viewer-material--datagrid {
        --rt-pos-cell--color: #338dcd;
        --rt-neg-cell--color: #ff471e;
        --column-style-open-button--content: 'menu';
        --column-style-close-button--content: 'expand_less';
        --tree-label-collapse--content: 'remove';
        --tree-label-expand--content: 'add';
        --toolbar-scroll-lock--content: 'lock_open';
        --toolbar-scroll-lock-active--content: 'lock';
        --toolbar-edit-mode--content: 'edit_off';
        --toolbar-edit-mode-active--content: 'edit';
    }
    .perspective-viewer-material--datagrid
        regular-table::-webkit-scrollbar-thumb {
        background-color: transparent;
    }
    .perspective-viewer-material--datagrid
        regular-table:hover::-webkit-scrollbar-thumb {
        background-color: #e0e4e9;
    }

    regular-table {
        padding: 0;
        margin: 12px 0 0 12px;
        scrollbar-color: transparent transparent;
        scrollbar-width: thin;
        outline: none;
    }
    regular-table:hover {
        scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
    }
    .sub-cell-scroll-enabled regular-table table tbody td,
    .sub-cell-scroll-enabled
        regular-table
        table
        thead
        th:not(.rt-group-corner) {
        transform: translate(var(--regular-table--transform-x, 0px));
    }
    .sub-cell-scroll-enabled regular-table table tbody {
        transform: translateY(var(--regular-table--transform-y, 0px));
    }
    .sub-cell-scroll-enabled regular-table table tbody tr:first-child td,
    .sub-cell-scroll-enabled regular-table table tbody tr:first-child th {
        clip-path: polygon(
            0 var(--regular-table--clip-y, 0),
            0 200%,
            200% 200%,
            200% var(--regular-table--clip-y, 0)
        );
    }
    .sub-cell-scroll-enabled regular-table table thead th.rt-group-corner {
        background: var(--plugin--background, white);
        z-index: 1;
    }
    .sub-cell-scroll-enabled regular-table table tbody tr td:first-of-type {
        clip-path: polygon(
            var(--regular-table--clip-x, 0) 0,
            var(--regular-table--clip-x, 0) 200%,
            200% 200%,
            200% 0
        );
    }
    .sub-cell-scroll-enabled
        regular-table
        table
        tbody
        tr:first-child
        td:first-of-type {
        clip-path: polygon(
            var(--regular-table--clip-x, 0) var(--regular-table--clip-y, 0),
            var(--regular-table--clip-x, 0) 200%,
            200% 200%,
            200% var(--regular-table--clip-y, 0)
        );
    }
    regular-table {
        font-family: inherit;
    }
    regular-table div[tabindex] {
        outline: none;
    }
    regular-table > div {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }
    regular-table th {
        text-align: center;
    }
    regular-table thead tr:not(:last-child) th {
        overflow: hidden;
        max-width: 0px;
    }
    regular-table thead tr:last-child .rt-float,
    regular-table tbody .rt-float {
        text-align: right;
    }
    regular-table thead .rt-integer,
    regular-table tbody .rt-integer {
        text-align: right;
    }
    regular-table tbody th {
        text-align: left;
    }
    regular-table span.rt-tree-container {
        display: flex;
        align-items: center;
        height: 100%;
    }
    regular-table thead .rt-string,
    regular-table tbody .rt-string,
    regular-table thead .rt-date,
    regular-table tbody .rt-date,
    regular-table thead .rt-datetime,
    regular-table tbody .rt-datetime {
        text-align: left;
    }
    regular-table thead tr:last-child th {
        border-bottom: 1px solid #eaedef;
    }
    regular-table tbody tr:first-child td,
    regular-table tbody tr:first-child th {
        border-top: 1px solid transparent !important;
    }
    regular-table th {
        position: relative;
    }
    regular-table tr th span.rt-tree-group {
        margin-left: 5px;
        margin-right: 15px;
        border-left: 1px solid #eee;
        height: 100%;
    }
    regular-table td,
    regular-table th {
        white-space: nowrap;
        font-size: 12px;
        padding: 0 5px;
        height: 19px;
    }
    regular-table tr:hover td {
        background: #eee;
        opacity: 1;
    }
    regular-table tr:hover {
        color: #333;
    }
    regular-table table * {
        box-sizing: border-box;
    }
    regular-table table {
        position: absolute;
        overflow: hidden;
        color: #666;
        outline: none;
    }
    regular-table span.rt-row-header-icon {
        color: #aaa;
        padding-right: 4px;
        font-family: var(--button--font-family, 'Material Icons');
    }
    regular-table span.rt-column-header-icon {
        font-size: 10px;
        padding-left: 3px;
        display: inline-block;
        width: 10px;
        font-family: var(--button--font-family, 'Material Icons');
    }
    regular-table span.rt-row-header-icon:hover {
        color: #1a7da1;
        text-shadow: 0px 0px 3px #1a7da1;
    }
    regular-table .rt-selected td {
        background-color: #eee;
    }
    regular-table .rt-cell-clip {
        overflow: hidden;
        text-overflow: ellipsis;
    }
    regular-table td span.rt-group-name,
    regular-table th span.rt-group-name {
        margin-right: -5px;
        padding-right: 5px;
        padding-left: 8px;
        flex: 1;
        height: 100%;
    }
    regular-table th span.rt-group-name {
        text-align: left;
    }
    regular-table td th span.rt-group-leaf,
    regular-table th span.rt-group-leaf {
        margin-left: 16px;
        height: 100%;
    }
    regular-table .rt-column-resize {
        height: 100%;
        width: 10px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: col-resize;
    }
    regular-table a {
        color: var(--rt-pos-cell--color);
    }
    regular-table a:visited {
        color: var(--active--color);
    }
    regular-table::-webkit-scrollbar,
    regular-table::-webkit-scrollbar-corner {
        background-color: transparent;
        height: 12px;
        width: 12px;
    }
    regular-table::-webkit-scrollbar-thumb {
        background-clip: content-box;
        background-color: #0000;
        border-radius: 5px;
    }
    regular-table::-webkit-scrollbar-thumb:horizontal {
        border-bottom: 2px solid transparent;
        border-top: 2px solid transparent;
    }
    regular-table::-webkit-scrollbar-thumb:vertical {
        border-left: 2px solid transparent;
        border-right: 2px solid transparent;
    }
    regular-table:hover::-webkit-scrollbar-thumb {
        background-color: #00000026;
    }
    regular-table::-webkit-scrollbar-thumb:hover {
        background-color: #0000004d;
    }
    .psp-header-border:not(.psp-is-top):not(.psp-header-leaf) {
        box-shadow: 1px 0 var(--inactive--color, #eaedef);
    }
    .psp-header-group {
        box-shadow: 0 10px 0 -9px var(--inactive--color, #eaedef);
    }
    .psp-is-top {
        box-shadow: 5px 4px 0 -4px var(--inactive--color, #eaedef);
    }
    .psp-is-top.psp-header-group:not(.psp-header-group-corner) {
        box-shadow: 5px 4px 0 -4px var(--inactive--color, #eaedef),
            0 10px 0 -9px var(--inactive--color, #eaedef);
    }
    .psp-header-border.psp-header-group:not(.psp-is-top):not(.psp-header-group-corner) {
        box-shadow: 1px 0 var(--inactive--color, #eaedef),
            0 10px 0 -9px var(--inactive--color, #eaedef);
    }
    .psp-header-leaf.psp-header-border {
        box-shadow: 5px -4px 0 -4px var(--inactive--color, #eaedef);
    }
    tr:only-child th {
        box-shadow: none !important;
    }
    regular-table
        tbody
        tr:hover
        th.psp-tree-leaf:not(.psp-row-selected):not(.psp-row-subselected),
    regular-table
        tbody
        tr:hover
        th.psp-tree-label:not(.psp-row-selected):not(.psp-row-subselected),
    regular-table
        tbody
        tr:hover
        td:not(.psp-row-selected):not(.psp-row-subselected) {
        border-color: var(--rt-hover--border-color, #c5c9d080) !important;
        background-color: transparent;
        box-shadow: 0 1px 0 var(--rt-hover--border-color, #c5c9d080),
            0 3px #0000000d, 0 5px #00000003;
    }
    regular-table
        tbody
        tr:hover
        + tr
        th.psp-tree-leaf:not(.psp-row-selected):not(.psp-row-subselected),
    regular-table
        tbody
        tr:hover
        + tr
        th.psp-tree-label:not(.psp-row-selected):not(.psp-row-subselected),
    regular-table
        tbody
        tr:hover
        + tr
        td:not(.psp-row-selected):not(.psp-row-subselected) {
        border-top-color: transparent;
    }
    regular-table tbody tr th:first-child:not(:empty),
    regular-table tbody tr th:first-child:empty + th:not(:empty),
    regular-table tbody tr th:first-child:empty ~ th:empty + th:not(:empty),
    regular-table tbody tr td:first-child {
        border-left-width: 1px;
        border-left-color: transparent;
    }
    regular-table tbody tr th:last-child,
    regular-table tbody tr td:last-child {
        border-right-width: 1px;
        border-right-color: transparent;
    }
    regular-table tbody tr:hover {
        color: #161616;
    }
    regular-table tbody tr:hover th:first-child:not(:empty),
    regular-table tbody tr:hover th:first-child:empty + th:not(:empty),
    regular-table
        tbody
        tr:hover
        th:first-child:empty
        ~ th:empty
        + th:not(:empty),
    regular-table tbody tr:hover td:first-child {
        border-left-color: var(--rt-hover--border-color, #c5c9d080) !important;
    }
    regular-table tbody tr:hover th:last-child,
    regular-table tbody tr:hover td:last-child {
        border-right-color: var(--rt-hover--border-color, #c5c9d080) !important;
    }
    perspective-viewer[settings] regular-table .psp-header-leaf {
        height: 36px;
        vertical-align: top;
        padding-top: 2px;
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf:not(.psp-header-corner):before {
        font-family: var(--button--font-family, inherit);
        content: var(
            --column-style-open-button--content,
            var(--config-button-icon--content, '\\1f527')
        );
        position: absolute;
        width: calc(100% - 8px);
        left: 5px;
        bottom: 0px;
        color: var(--inactive--color, #b4b7be);
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf.psp-menu-enabled:not(.psp-header-corner):before {
        color: inherit;
        cursor: pointer;
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf.psp-menu-open:not(.psp-header-corner) {
        pointer-events: none;
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf.psp-menu-open:not(.psp-header-corner):before {
        content: var(--column-style-close-button--content, 'X');
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf.psp-menu-enabled:hover:before {
        color: #338dcd;
    }
    perspective-viewer[settings]
        regular-table
        .psp-header-leaf
        .rt-column-resize {
        height: 18px;
    }
    .psp-row-selected,
    :hover .psp-row-selected,
    :hover th.psp-tree-leaf.psp-row-selected,
    :hover th.psp-tree-label.psp-row-selected {
        color: #fff !important;
        background-color: #ea7319 !important;
        border-color: #ea7319 !important;
    }
    .psp-row-selected.psp-tree-label:not(:hover):before {
        color: #fff;
    }
    .psp-row-subselected,
    :hover .psp-row-subselected,
    :hover th.psp-tree-leaf.psp-row-subselected,
    :hover th.psp-tree-label.psp-row-subselected {
        background: rgba(234, 115, 25, 0.2) !important;
    }
    .psp-error {
        color: red;
    }
    td:focus {
        outline: #666;
        outline-style: dotted;
        outline-width: 1px;
    }
    perspective-viewer.dragging regular-table {
        pointer-events: none;
    }
    .psp-header-border:last-child {
        border-right-width: 0px;
    }
    .psp-header-sort-desc:after {
        font-family: var(--button--font-family, inherit);
        font-size: 10px;
        content: var(--sort-order-desc--content, '\\2193');
    }
    .psp-header-sort-asc:after {
        font-family: var(--button--font-family, inherit);
        font-size: 10px;
        content: var(--sort-order-asc--content, '\\2191');
    }
    .psp-header-sort-col-desc:after {
        font-family: var(--button--font-family, inherit);
        font-size: 10px;
        content: var(--sort-order-col-desc--content, '\\2190');
    }
    .psp-header-sort-col-asc:after {
        font-family: var(--button--font-family, inherit);
        font-size: 10px;
        content: var(--sort-order-col-asc--content, '\\2192');
    }
    tbody th:last-of-type {
        border-right: 1px solid #eaedef;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    tbody th:empty {
        background-image: linear-gradient(
            to right,
            transparent 9px,
            #eee 10px,
            transparent 11px
        );
        background-repeat: no-repeat;
        min-width: 20px;
        max-width: 20px;
        pointer-events: none;
    }
    .psp-tree-label {
        max-width: 0px;
        min-width: 0px;
    }
    .psp-tree-label:before {
        color: #ccc;
        font-family: var(--button--font-family, inherit);
        padding-right: 11px;
        vertical-align: -1px;
    }
    .psp-tree-label-expand:before {
        content: var(--tree-label-expand--content, '+');
    }
    .psp-tree-label-collapse:before {
        content: var(--tree-label-collapse--content, '-');
    }
    .psp-tree-label:hover:before {
        color: #338dcd;
        text-shadow: 0px 0px 5px #338dcd;
    }
    regular-table thead tr:last-child th {
        border-bottom-width: 1px;
        border-bottom-color: var(--inactive--color, #eaedef);
    }
    .psp-tree-leaf {
        padding-left: 24px;
    }
    .psp-align-right {
        text-align: right;
    }
    .psp-align-left {
        text-align: left;
    }
    .psp-positive:not(:focus) {
        color: var(--rt-pos-cell--color, #338dcd);
    }
    .psp-negative:not(:focus) {
        color: var(--rt-neg-cell--color, #ff5942);
    }
    regular-table table tbody td {
        min-width: 52px !important;
    }
    .psp-is-width-override .rt-column-resize,
    .rt-column-resize:hover {
        border: 1px dashed #999;
        border-bottom-width: 0px;
        border-left-width: 0px;
    }
    .psp-bool-type {
        font-family: var(--button--font-family, 'Material Icons');
    }
    .boolean-editable {
        cursor: pointer;
    }
    regular-table table {
        user-select: none;
        color: #161616;
        border-collapse: separate;
    }
    regular-table table th {
        font-weight: 400;
    }
    regular-table table td,
    regular-table table th {
        border-color: #eaedef;
        height: 23px;
    }
    regular-table table .psp-header-group {
        text-overflow: ellipsis;
    }
    regular-table table .psp-header-leaf {
        border-bottom-width: 0px;
    }
    regular-table table td,
    regular-table table th.psp-tree-label,
    regular-table table th.psp-tree-label,
    regular-table table th.psp-tree-leaf,
    regular-table table tbody tr:first-child th {
        border-style: solid;
        border-width: 0px;
        border-top-width: 1px;
    }
    regular-table table tbody th:empty {
        background-position: 0px -10px;
    }
    @keyframes pulse_pos {
        0% {
            background-color: var(
                --pulse--background-color-start,
                rgba(0, 128, 255, 0.5)
            );
        }
        to {
            background-color: var(
                --pulse--background-color-end,
                rgba(0, 128, 255, 0)
            );
        }
    }
    @keyframes pulse_pos2 {
        0% {
            background-color: var(
                --pulse--background-color-start,
                rgba(0, 128, 255, 0.5)
            );
        }
        to {
            background-color: var(
                --pulse--background-color-end,
                rgba(0, 128, 255, 0)
            );
        }
    }
    @keyframes pulse_neg {
        0% {
            background-color: var(
                --pulse--background-color-start,
                rgba(255, 25, 0, 0.5)
            );
        }
        to {
            background-color: var(
                --pulse--background-color-end,
                rgba(255, 25, 0, 0)
            );
        }
    }
    @keyframes pulse_neg2 {
        0% {
            background-color: var(
                --pulse--background-color-start,
                rgba(255, 25, 0, 0.5)
            );
        }
        to {
            background-color: var(
                --pulse--background-color-end,
                rgba(255, 25, 0, 0)
            );
        }
    }
`;

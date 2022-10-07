import { css } from '@microsoft/fast-element';

export const styles = css`
  :host {
    display: flex;
    width: 100%;
    height: 600px;
    overflow-y: scroll;
  }

  .table-container {
    display: flex;
    flex-direction: column;
    width: inherit;
  }

  .table-header {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
    display: flex;
    flex-direction: row;
  }

  .table-viewport {
    overflow-y: scroll;
    display: block;
    height: 100%;
  }

  .table-body {
    width: 100%;
    position: relative;
  }

  th span{
    pointer-events: none;
  }

  th * {
    display: block;
    font: var(--ni-nimble-group-header-font);
    text-transform: uppercase;
  }

  tr {
    vertical-align: top;
  }
`;

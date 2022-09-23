import { css } from '@microsoft/fast-element';

export const styles = css`
  :host {
    display: flex;
    overflow-y: scroll;
    width: fit-content;
  }

  th {
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
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

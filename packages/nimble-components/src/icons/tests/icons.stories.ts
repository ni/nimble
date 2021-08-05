import * as nimbleIconsMap from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

const nimbleIcons = Object.values(nimbleIconsMap);

const styleMarkup = `
<style>
  .container {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .icon {
    box-sizing: border-box;
    width: 60px;
    height: 60px;
    padding: 20px;
  }

  .icon svg {
    height: 32px;
    width: 32px;
  }
</style>
`;

export default {
    title: 'Nimble Icons'
};

export const icons = (): string => `
${styleMarkup}
<div class="container">
  ${nimbleIcons
        .map(
            icon => `<div class="icon" title="${icon.name}">${icon.data}</div>`
        )
        .join('')}
</div>`;

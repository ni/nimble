import svgFile from '@ni/nimble-tokens/dist-icons/nimble-icons.symbol.svg';
import { nimbleIconNames } from '../shared/icon-font';
import '@ni/nimble-tokens/dist-icons/nimble-icons-font-face.css';
import '@ni/nimble-tokens/dist-icons/nimble-icons.css';

export default {
    title: 'Icons'
};

const nimbleIconNameArray = Object.values(nimbleIconNames);
const svgIconPath = svgFile as string;

const styleMarkup = `
<style>
  ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
  }

  li {
    box-sizing: border-box;
    list-style: none;
    width: 60px;
    height: 60px;
    padding: 20px;
    position: relative;
    display: flex;
    justify-content: center; 
  }
  i {
    cursor: pointer;
    background-size: 50px;
    font-size: 3.75em;
  }
</style>
`;

export const svgIcons = (): string => `
${styleMarkup}
<ul>
  ${nimbleIconNameArray
        .map(
            iconName => `<li><svg><use xlink:href="${svgIconPath}#${iconName}" title="${iconName}"/></svg></li>`
        )
        .join('')}
</ul>`;

export const fontIcons = (): string => `
${styleMarkup}
<ul>
  ${nimbleIconNameArray
        .map(iconName => `<li><i title="${iconName}" class="${iconName}"></i></li>`)
        .join('')}
</ul>`;

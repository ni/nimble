import { css } from '@microsoft/fast-element';

const styleString = String.raw`
[class^="{{prefix}}-"], [class*=" {{prefix}}-"] {
  font-family: '{{fontname}}' !important;
  font-size:{{fontSize}};
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

{{cssString}}
`;
const fastStyleString = css([styleString]);
export default fastStyleString;

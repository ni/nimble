import { html, repeat, ref  } from '@microsoft/fast-element';
import type { WaferMap } from '.';

export const template = html<WaferMap>`
<div>
    ${ x => {
        if(x.renderReady){return WaferTemplate;}
        return notReadyTemplate
        }
    }
</div>
`;

const notReadyTemplate = html<WaferMap>`
<div>
    Loading....
</div>
`;

const WaferTemplate = html<WaferMap>`
<div>
    <ul>
        ${repeat(x=>x.dies, html`
            <li>
                ${(x,c)=>{return `dieX: ${x.x}, dieY: ${x.y}, value: ${x.value}%`}}
            </li>
        `)}
    <ul>
<div>
`;
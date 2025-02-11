import { webviCustom16X16 } from '@ni/nimble-tokens/dist/icons/js';

const imgBlob = new Blob([webviCustom16X16.data], {
    type: 'image/svg+xml'
});
export const imgBlobUrl = URL.createObjectURL(imgBlob);

export const markdownExample = "I see **Esc**, **Crtl**, and **Pg Up**. There doesn't seem to be any **Any** key.";

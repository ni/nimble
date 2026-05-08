// Visual Design is iterating on this icon for NI Connect 2026; it's likely we will get different
// icons for dark and light mode in future but for now they like the dark icon even on light background.
// Both exports use the same visual but with unique IDs to avoid collisions when both are in the DOM.
export const nigelChatLightData = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 16 16">
  <defs>
    <style>
      .nigel-chat-light-0 {
        fill: url(#nigel-chat-gradient-light-0);
      }

      .nigel-chat-light-1 {
        fill: url(#nigel-chat-gradient-light-1);
      }
    </style>
    <linearGradient id="nigel-chat-gradient-light-1" x1="11.84" y1="6.19" x2="4.84" y2="13.18" gradientTransform="translate(0 18) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00ad7c"/>
      <stop offset="1" stop-color="#32eb96"/>
    </linearGradient>
    <linearGradient id="nigel-chat-gradient-light-0" x1="10.25" y1="-658.82" x2="6.95" y2="-662.11" gradientTransform="translate(0 668)" xlink:href="#nigel-chat-gradient-light-1"/>
  </defs>
  <path class="nigel-chat-light-1" d="M14.21,7.52l-.11-.06c-2.36-1.29-4.3-3.23-5.59-5.59l-.06-.11c-.19-.36-.7-.36-.9,0l-.06.11c-1.29,2.36-3.23,4.3-5.59,5.59l-.11.06c-.36.19-.36.7,0,.9l.11.06c2.36,1.29,4.3,3.23,5.59,5.59l.06.11c.19.36.7.36.9,0l.06-.11c1.29-2.36,3.23-4.3,5.59-5.59l.11-.06c.36-.19.36-.7,0-.9ZM12.5,7.88l-.08.04c-1.58.87-2.89,2.17-3.75,3.75l-.04.08c-.13.24-.47.24-.6,0l-.04-.08c-.87-1.58-2.17-2.89-3.75-3.75l-.08-.04c-.24-.13-.24-.47,0-.6l.08-.04c1.58-.87,2.89-2.17,3.75-3.75l.04-.08c.13-.24.47-.24.6,0l.04.08c.87,1.58,2.17,2.89,3.75,3.75l.08.04c.24.13.24.47,0,.6Z"/>
  <path class="nigel-chat-light-0" d="M11.36,7.6l-.03.02c-1.12.61-2.04,1.53-2.65,2.65l-.02.03c-.1.18-.35.18-.45,0l-.02-.03c-.61-1.12-1.53-2.04-2.65-2.65l-.03-.02c-.18-.1-.18-.35,0-.45l.03-.02c1.12-.61,2.04-1.53,2.65-2.65l.02-.03c.1-.18.35-.18.45,0l.02.03c.61,1.12,1.53,2.04,2.65,2.65l.03.02c.18.1.18.35,0,.45Z"/>
</svg>`;

export const nigelChatDarkData = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 16 16">
  <defs>
    <style>
      .nigel-chat-dark-0 {
        fill: url(#nigel-chat-gradient-dark-0);
      }

      .nigel-chat-dark-1 {
        fill: url(#nigel-chat-gradient-dark-1);
      }
    </style>
    <linearGradient id="nigel-chat-gradient-dark-1" x1="11.84" y1="6.19" x2="4.84" y2="13.18" gradientTransform="translate(0 18) scale(1 -1)" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#00ad7c"/>
      <stop offset="1" stop-color="#32eb96"/>
    </linearGradient>
    <linearGradient id="nigel-chat-gradient-dark-0" x1="10.25" y1="-658.82" x2="6.95" y2="-662.11" gradientTransform="translate(0 668)" xlink:href="#nigel-chat-gradient-dark-1"/>
  </defs>
  <path class="nigel-chat-dark-1" d="M14.21,7.52l-.11-.06c-2.36-1.29-4.3-3.23-5.59-5.59l-.06-.11c-.19-.36-.7-.36-.9,0l-.06.11c-1.29,2.36-3.23,4.3-5.59,5.59l-.11.06c-.36.19-.36.7,0,.9l.11.06c2.36,1.29,4.3,3.23,5.59,5.59l.06.11c.19.36.7.36.9,0l.06-.11c1.29-2.36,3.23-4.3,5.59-5.59l.11-.06c.36-.19.36-.7,0-.9ZM12.5,7.88l-.08.04c-1.58.87-2.89,2.17-3.75,3.75l-.04.08c-.13.24-.47.24-.6,0l-.04-.08c-.87-1.58-2.17-2.89-3.75-3.75l-.08-.04c-.24-.13-.24-.47,0-.6l.08-.04c1.58-.87,2.89-2.17,3.75-3.75l.04-.08c.13-.24.47-.24.6,0l.04.08c.87,1.58,2.17,2.89,3.75,3.75l.08.04c.24.13.24.47,0,.6Z"/>
  <path class="nigel-chat-dark-0" d="M11.36,7.6l-.03.02c-1.12.61-2.04,1.53-2.65,2.65l-.02.03c-.1.18-.35.18-.45,0l-.02-.03c-.61-1.12-1.53-2.04-2.65-2.65l-.03-.02c-.18-.1-.18-.35,0-.45l.03-.02c1.12-.61,2.04-1.53,2.65-2.65l.02-.03c.1-.18.35-.18.45,0l.02.03c.61,1.12,1.53,2.04,2.65,2.65l.03.02c.18.1.18.35,0,.45Z"/>
</svg>`;

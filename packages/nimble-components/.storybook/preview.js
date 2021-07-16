// import * as FAST from "../src/index-rollup";

// FAST;

import { addDecorator } from "@storybook/html";

import "@ni/nimble-tokens/dist-icons/nimble-icons-font-face.css";
import "@ni/nimble-tokens/source/space-mono-font-face.css";
import "@ni/nimble-tokens/source/source-sans-pro-font-face.css";
import "@ni/nimble-components/src/theme-provider/index";

export const parameters = {
  layout: "fullscreen",
  backgrounds: {
    values: [
      {
        name: "light-ui",
        value: "#F4F4F4"
      },
      {
        name: "green-ui",
        value: "#03B585"
      },
      {
        name: "dark-green-ui",
        value: "#044123"
      },
      {
        name: "dark-ui",
        value: "#252526"
      }
    ]
  }
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "LIGHT",
    toolbar: {
      icon: "circlehollow",
      // array of plain string values for theme.
      items: ["clear", "LIGHT", "DARK"]
    }
  }
};

const storyAsString = (story, theme) =>
  `<nimble-theme-provider theme="${theme}">${story}</nimble-theme-provider>`;

const storyAsNode = (story, theme) => {
  const wrapper = document.createElement("nimble-theme-provider");
  // wrapper.attributes = [theme]; TODO - develop with real component
  wrapper.appendChild(story);
  return wrapper;
};

addDecorator((story, context) => {
  const tale = story();
  const theme = context?.globals?.theme || "LIGHT";
  console.log(tale);
  console.log(theme);
  return typeof tale === "string"
    ? storyAsString(tale, theme)
    : storyAsNode(tale, theme);
});

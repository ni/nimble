# Tips for using Adobe XD to inspect component designs

This describes tips to inspect the visual design for a component in Adobe XD and extract the information needed to develop it in code.

## Finding the design spec

The visual design specs are stored in the [Nimble_Components Adobe XD Document](https://xd.adobe.com/view/8ce280ab-1559-4961-945c-182955c7780b-d9b1/) (viewable in a web browser or desktop application; these instructions cover the web browser). This is maintained by the NI Visual Design team.

1. To navigate the document, ensure you're in "Comments" mode by clicking the "speech bubble" icon in the right bar.

![Right bar](/packages/nimble-components/docs/images/xd-right-bar.png)

2. To go to the table of contents, click the "home" icon at the bottom of the document.

![Home](/packages/nimble-components/docs/images/xd-home-and-pages.png)

3. From the table of contents, click on the button for a component to navigate to its design specs.

![Components](/packages/nimble-components/docs/images/xd-components.png)

4. Each component is rendered in different themes with different backgrounds. Use the page buttons to navigate between them.

![Pages](/packages/nimble-components/docs/images/xd-home-and-pages.png)



## Inspecting component parts

1. To inspect component parts, ensure you're in "Specs" mode by clicking the "HTML tag" icon in the right bar.

![Right bar](/packages/nimble-components/docs/images/xd-right-bar.png)

2. Zoom in to see component parts at higher detail.

![Zoom](/packages/nimble-components/docs/images/xd-zoom.png)

3. Select a specific part by right-clicking the part and choosing the layer of interest.

![Parts](/packages/nimble-components/docs/images/xd-parts-menu.png)

4. View the tokens used to construct that part in the "Appearance" section of the right configuration pane. Colors generally map to base token names in `nimble-tokens`. Don't forget to check the opacity value; they often vary from 100%.

![Parts](/packages/nimble-components/docs/images/xd-appearance.png)

5. To view the component in a different state or theme, you can either:
    1. navigate to that preconfigured copy of the component on one of the theme pages
    2. configure the component you've already selected to use that state or theme by selecting it from the "Component: Default State" section of the right configuration pane

![States](/packages/nimble-components/docs/images/xd-states.png)


export const targetGuidelines = `
In general, when adding an anchor element to a web application, the anchor should not have a \`target\` configured on it to control how the link is opened.
Instead, the user should be able to decide how they want to navigate using browser features, such as \`CTRL + Click\` or \`Right-click >> Open New Tab\`. For more information
about when it is appropriate to force users to open links in a new tab or window, see the [WCAG guidelines for opening new tabs and windows](https://www.w3.org/TR/WCAG20-TECHS/G200.html).
Additionally, if an application will open the link in a new tab or window, ensure that is clearly conveyed to the user based on the
[WCAG guidelines for giving users advanced warning when opening a new window](https://www.w3.org/TR/WCAG20-TECHS/G201.html).
`;
